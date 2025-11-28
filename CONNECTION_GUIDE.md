# Frontend-Backend Connection Guide

## ✅ Connection Status

The frontend and backend are now properly configured to work together!

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```
MONGODB_URI=mongodb://localhost:27017/grampanchayat
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm start
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
📡 API endpoint: http://localhost:5000/api/data
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

(Optional) Create a `.env` file in the `frontend` directory if you need to change the API URL:
```
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` and automatically connect to the backend at `http://localhost:5000`.

## How It Works

### API Structure

The frontend uses a **path-based API** (similar to Firestore) that the backend now supports:

- **Collection**: `members`, `schemes`, `news`, etc.
- **Document**: `members/123`, `schemes/456`, etc.

### Example API Calls

1. **Get all members**:
   - Frontend: `getDocs(collection(db, 'members'))`
   - Backend: `GET /api/data?path=members`

2. **Get single document**:
   - Frontend: `getDoc(doc(db, 'members', '123'))`
   - Backend: `GET /api/data/doc?path=members/123`

3. **Create document**:
   - Frontend: `addDoc(collection(db, 'members'), data)`
   - Backend: `POST /api/data` with `{ path: 'members', data: {...} }`

4. **Update document**:
   - Frontend: `updateDoc(doc(db, 'members', '123'), data)`
   - Backend: `PATCH /api/data` with `{ path: 'members/123', data: {...} }`

5. **Delete document**:
   - Frontend: `deleteDoc(doc(db, 'members', '123'))`
   - Backend: `DELETE /api/data` with `{ path: 'members/123' }`

## Troubleshooting

### Backend not connecting to MongoDB
- Make sure MongoDB is running: `mongod` (or MongoDB service is started)
- Check your `MONGODB_URI` in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### CORS Errors
- Backend CORS is configured to allow `http://localhost:3000`
- If frontend runs on a different port, update `FRONTEND_URL` in backend `.env`

### API Connection Errors
- Verify backend is running on port 5000
- Check browser console for specific error messages
- Verify `VITE_API_BASE_URL` in frontend `.env` (if set)

### Data Not Loading
- Check MongoDB connection in backend logs
- Verify collection names match (case-sensitive)
- Check browser Network tab to see API requests/responses

## Testing the Connection

1. Start both servers (backend and frontend)
2. Open browser DevTools → Network tab
3. Navigate to a page that uses data (e.g., Manage Members)
4. You should see requests to `http://localhost:5000/api/data`
5. Check backend console for request logs

## Next Steps

- Add authentication endpoints if needed (`/api/auth/login`, etc.)
- Add more specific validation for your data models
- Set up environment-specific configurations for production

