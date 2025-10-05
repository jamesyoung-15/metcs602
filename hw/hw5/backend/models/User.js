import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// User account schema for MongoDB
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  defaultLanguage: {
    type: String,
    enum: ['en', 'it', 'fr', 'es'],
    default: 'en'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// hash password using bcrypt w/ 5 salt rounds
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 5);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);