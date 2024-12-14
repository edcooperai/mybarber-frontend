import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import passwordValidator from 'password-validator';

const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().symbols(1)
  .has().not().spaces();

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(password) {
        return passwordSchema.validate(password);
      },
      message: 'Password must be at least 8 characters long, contain uppercase and lowercase letters, numbers, and special characters'
    }
  },
  name: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  refreshToken: String,
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Increment failed login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  // Reset failed attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.failedLoginAttempts = 1;
    this.lockUntil = null;
  } else {
    this.failedLoginAttempts += 1;
    
    // Lock account if more than 5 failed attempts
    if (this.failedLoginAttempts >= 5) {
      this.lockUntil = Date.now() + (15 * 60 * 1000); // Lock for 15 minutes
    }
  }
  
  await this.save();
};

export default mongoose.model('User', userSchema);