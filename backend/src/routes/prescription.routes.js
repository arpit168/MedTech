import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadPrescription, getUserPrescriptions } from '../controllers/prescription.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();


const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images are allowed'));
  }
});

router.post('/upload', protect, upload.single('prescription'), uploadPrescription);
router.get('/', protect, getUserPrescriptions);

export default router;