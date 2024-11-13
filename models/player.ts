import mongoose from 'mongoose';

const MonthlyStatSchema = new mongoose.Schema({
  month: { type: String, required: true },
  value: { type: Number, required: true }
});

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  sprintSpeed: {
    type: [MonthlyStatSchema],  // Changed to array of MonthlyStats
    required: true,
    default: []
  },
  verticalJump: {
    type: [MonthlyStatSchema],  // Changed to array of MonthlyStats
    required: true,
    default: []
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Player || mongoose.model('Player', playerSchema);