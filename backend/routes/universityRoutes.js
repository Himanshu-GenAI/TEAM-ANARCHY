import express from 'express';
import { registerUniversity, loginUniversity, getStudentsByUniversity } from '../controllers/universityController.js';

const router = express.Router();

// POST /api/university/register
router.post('/register', registerUniversity);

// POST /api/university/login
router.post('/login', loginUniversity);

// GET /api/university/:id/students
router.get('/:id/students', getStudentsByUniversity);

export default router;
