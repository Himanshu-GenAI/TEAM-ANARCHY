import express from 'express';
import { joinUniversity, getStudentDetails } from '../controllers/studentController.js';

const router = express.Router();

// POST /api/student/join
router.post('/join', joinUniversity);

// GET /api/student/:id
router.get('/:id', getStudentDetails);

export default router;
