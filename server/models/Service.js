import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 5
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String,
    required: true
  },
  description: String
}, {
  timestamps: true
});

// Compound index for user's services
serviceSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('Service', serviceSchema);