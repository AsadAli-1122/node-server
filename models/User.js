import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  updatedAt: { type: Date },
  phone: { type: String },
  role: { type: String, default: 'user' },
});

const User = mongoose.model('User', userSchema);

export default User;
