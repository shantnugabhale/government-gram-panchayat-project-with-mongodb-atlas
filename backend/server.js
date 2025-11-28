// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS configuration - allow frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grampanchayat';
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.log("❌ DB Error:", err);
    console.log("⚠️  Make sure MongoDB is running or set MONGODB_URI in .env file");
  });

// Generic Schema (flexible for all collections)
const AnySchema = new mongoose.Schema({}, { strict: false, timestamps: true });

// Helper function to get or create model
const getModel = (collectionName) => {
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName];
  }
  return mongoose.model(collectionName, AnySchema);
};

// Helper function to parse path (e.g., "members" or "members/123")
const parsePath = (path) => {
  if (!path) return { collection: null, docId: null };
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return { collection: null, docId: null };
  if (parts.length === 1) return { collection: parts[0], docId: null };
  return { collection: parts[0], docId: parts[1] };
};

// Helper function to build MongoDB query from filters
const buildQuery = (filters) => {
  if (!filters || !Array.isArray(filters)) return {};
  
  const query = {};
  filters.forEach(filter => {
    if (!filter.field || !filter.op) return;
    
    const field = filter.field;
    const value = filter.value;
    
    switch (filter.op) {
      case '==':
      case '===':
        query[field] = value;
        break;
      case '!=':
      case '!==':
        query[field] = { $ne: value };
        break;
      case '<':
        query[field] = { $lt: value };
        break;
      case '<=':
        query[field] = { $lte: value };
        break;
      case '>':
        query[field] = { $gt: value };
        break;
      case '>=':
        query[field] = { $gte: value };
        break;
      case 'in':
        query[field] = { $in: Array.isArray(value) ? value : [value] };
        break;
      case 'array-contains':
        query[field] = value;
        break;
      default:
        query[field] = value;
    }
  });
  
  return query;
};

// Helper function to build sort object from sorts array
const buildSort = (sorts) => {
  if (!sorts || !Array.isArray(sorts) || sorts.length === 0) {
    return { createdAt: -1 }; // Default sort
  }
  
  const sortObj = {};
  sorts.forEach(sort => {
    if (sort.field) {
      sortObj[sort.field] = sort.direction === 'desc' ? -1 : 1;
    }
  });
  
  return sortObj;
};

// ========== API Routes for /api/data ==========

// GET /api/data/ - Get multiple documents (collection query)
app.get('/api/data', async (req, res) => {
  try {
    const { path, filters, sorts, limit: limitValue } = req.query;
    
    if (!path) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }
    
    const { collection, docId } = parsePath(path);
    
    if (!collection) {
      return res.status(400).json({ error: 'Invalid path: collection name required' });
    }
    
    if (docId) {
      // If path includes doc ID, return single document
      const Model = getModel(collection);
      const doc = await Model.findById(docId);
      return res.json(doc ? [doc] : []);
    }
    
    const Model = getModel(collection);
    let query = Model.find(buildQuery(filters ? JSON.parse(filters) : []));
    
    // Apply sorting
    const sortObj = buildSort(sorts ? JSON.parse(sorts) : []);
    query = query.sort(sortObj);
    
    // Apply limit
    if (limitValue) {
      query = query.limit(parseInt(limitValue));
    }
    
    const data = await query.exec();
    res.json(data);
  } catch (error) {
    console.error('GET /api/data error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/data/doc - Get single document
app.get('/api/data/doc', async (req, res) => {
  try {
    const { path } = req.query;
    
    if (!path) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }
    
    const { collection, docId } = parsePath(path);
    
    if (!collection || !docId) {
      return res.status(404).json(null);
    }
    
    const Model = getModel(collection);
    const doc = await Model.findById(docId);
    
    if (!doc) {
      return res.status(404).json(null);
    }
    
    res.json(doc);
  } catch (error) {
    console.error('GET /api/data/doc error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json(null);
    }
    res.status(500).json({ error: error.message });
  }
});

// POST /api/data/ - Create new document
app.post('/api/data', async (req, res) => {
  try {
    const { path, data } = req.body;
    
    if (!path) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }
    
    const { collection, docId } = parsePath(path);
    
    if (!collection) {
      return res.status(400).json({ error: 'Invalid path: collection name required' });
    }
    
    if (docId) {
      return res.status(400).json({ error: 'Cannot specify document ID in POST request' });
    }
    
    const Model = getModel(collection);
    const newDoc = await Model.create(data || {});
    
    res.json({ id: newDoc._id.toString(), ...newDoc.toObject() });
  } catch (error) {
    console.error('POST /api/data error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/data/ - Create or replace document
app.put('/api/data', async (req, res) => {
  try {
    const { path, data } = req.body;
    
    if (!path) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }
    
    const { collection, docId } = parsePath(path);
    
    if (!collection) {
      return res.status(400).json({ error: 'Invalid path: collection name required' });
    }
    
    const Model = getModel(collection);
    
    if (docId) {
      // Update existing document
      const updated = await Model.findByIdAndUpdate(
        docId,
        { ...data, updatedAt: new Date() },
        { new: true, upsert: false }
      );
      
      if (!updated) {
        return res.status(404).json({ error: 'Document not found' });
      }
      
      res.json(updated);
    } else {
      // Create new document
      const newDoc = await Model.create(data || {});
      res.json(newDoc);
    }
  } catch (error) {
    console.error('PUT /api/data error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/data/ - Update document (partial update)
app.patch('/api/data', async (req, res) => {
  try {
    const { path, data } = req.body;
    
    if (!path) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }
    
    const { collection, docId } = parsePath(path);
    
    if (!collection || !docId) {
      return res.status(400).json({ error: 'Document ID is required for PATCH request' });
    }
    
    const Model = getModel(collection);
    const updated = await Model.findByIdAndUpdate(
      docId,
      { ...data, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(updated);
  } catch (error) {
    console.error('PATCH /api/data error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/data/ - Delete document
app.delete('/api/data', async (req, res) => {
  try {
    // Support both body and query params for DELETE
    const path = req.body?.path || req.query?.path;
    
    if (!path) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }
    
    const { collection, docId } = parsePath(path);
    
    if (!collection || !docId) {
      return res.status(400).json({ error: 'Document ID is required for DELETE request' });
    }
    
    const Model = getModel(collection);
    const deleted = await Model.findByIdAndDelete(docId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json({ message: 'Document deleted successfully', id: docId });
  } catch (error) {
    console.error('DELETE /api/data error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/data`);
  console.log(`🔗 Frontend should connect to: http://localhost:${PORT}`);
});
