import express from 'express';
import { addSymptomEntry, getTimeline, generateDoctorSummary } from '../controllers/symptom.controller.js';
import { protect } from '../middleware/auth.middleware.js';


const router = express.Router();


router.post('/entries', protect, addSymptomEntry);
router.get('/timeline', protect, getTimeline);
router.get('/doctor-summary', protect, generateDoctorSummary);

export default router;