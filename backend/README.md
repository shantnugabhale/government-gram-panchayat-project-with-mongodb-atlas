# Backend Setup

## Prerequisites
- Node.js installed
- MongoDB installed and running (or MongoDB Atlas account)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following:
```
MONGODB_URI=mongodb://localhost:27017/grampanchayat
PORT=5000
FRONTEND_URL=http://localhost:3000
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grampanchayat
```

## Running the Server

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

The backend provides a path-based API at `/api/data` that matches the frontend's expected structure:

- **GET** `/api/data?path=collection` - Get all documents from a collection
- **GET** `/api/data/doc?path=collection/docId` - Get a single document
- **POST** `/api/data` - Create a new document
- **PUT** `/api/data` - Create or replace a document
- **PATCH** `/api/data` - Update a document (partial)
- **DELETE** `/api/data` - Delete a document

## Frontend Connection

The frontend is configured to connect to `http://localhost:5000` by default. Make sure:
1. Backend is running on port 5000
2. Frontend is running on port 3000 (or update FRONTEND_URL in .env)
3. MongoDB is running and accessible

