import Student from '../models/Student.js';
import University from '../models/University.js';

// POST /api/student/join
export const joinUniversity = async (req, res) => {
  try {
    const { name, email, joinCode } = req.body;

    if (!name || !email || !joinCode) {
      return res.status(400).json({ success: false, message: 'Name, email, and joinCode are required.' });
    }

    // Find university by join code (case-insensitive)
    const university = await University.findOne({ joinCode: joinCode.toUpperCase() });
    if (!university) {
      return res.status(404).json({ success: false, message: 'Invalid join code. University not found.' });
    }

    // Check for duplicate student email within the same university
    const existingStudent = await Student.findOne({ email: email.toLowerCase(), universityId: university._id });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Student with this email is already in this university.' });
    }

    const student = await Student.create({
      name,
      email: email.toLowerCase(),
      universityId: university._id,
    });

    res.status(201).json({
      success: true,
      message: `Successfully joined ${university.name}!`,
      data: {
        studentId: student._id,
        name: student.name,
        email: student.email,
        university: {
          id: university._id,
          name: university.name,
          joinCode: university.joinCode,
        },
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/student/:id
export const getStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id).populate('universityId', 'name email joinCode createdAt');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        university: student.universityId,
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
