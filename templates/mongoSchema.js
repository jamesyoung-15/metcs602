import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Pre-save hook to hash email and password before saving
userSchema.pre('save', async function (next) {
  try {
    // Hash the email
    if (this.isModified('email')) {
      this.email = await bcrypt.hash(this.email, SALT_WORK_FACTOR);
    }

    // Hash the password
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    }

    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

export default User;