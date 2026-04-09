import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: [true, 'University ID is required'],
    },
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
