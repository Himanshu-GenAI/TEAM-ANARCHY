import University from '../models/University.js';
import Student from '../models/Student.js';

/**
 * Generate a unique join code: first 4 letters of name (uppercase) + 4 random digits
 * e.g. "Lnct University" → "LNCT4821"
 */
const generateJoinCode = (name) => {
  const prefix = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
  const suffix = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `${prefix}${suffix}`;
};

// POST /api/university/register
export const registerUniversity = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    // Check for existing university with same email
    const existing = await University.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'University with this email already exists.' });
    }

    // Generate a unique join code (retry if collision)
    let joinCode;
    let attempts = 0;
    do {
      joinCode = generateJoinCode(name);
      const codeExists = await University.findOne({ joinCode });
      if (!codeExists) break;
      attempts++;
    } while (attempts < 10);

    const university = await University.create({ name, email, joinCode });

    res.status(201).json({
      success: true,
      message: 'University registered successfully!',
      data: {
        id: university._id,
        name: university.name,
        email: university.email,
        joinCode: university.joinCode,
        createdAt: university.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/university/login
export const loginUniversity = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const university = await University.findOne({ email: email.toLowerCase() });
    if (!university) {
      return res.status(404).json({ success: false, message: 'No university found with this email. Please register first.' });
    }

    const studentCount = await Student.countDocuments({ universityId: university._id });

    res.status(200).json({
      success: true,
      data: {
        id: university._id,
        name: university.name,
        email: university.email,
        joinCode: university.joinCode,
        studentCount,
        createdAt: university.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/university/:id/students
export const getStudentsByUniversity = async (req, res) => {
  try {
    const { id } = req.params;

    const university = await University.findById(id);
    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found.' });
    }

    const students = await Student.find({ universityId: id }).select('-__v');

    res.status(200).json({
      success: true,
      university: {
        id: university._id,
        name: university.name,
        joinCode: university.joinCode,
      },
      totalStudents: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
