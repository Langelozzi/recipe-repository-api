import multer from 'multer';

// Use memory storage for Vercel serverless compatibility
// Files are stored in memory as Buffer objects instead of on disk
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });