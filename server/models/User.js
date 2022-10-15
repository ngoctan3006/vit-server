import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    positions: {
      type: [String],
      default: ['member'],
    },
    displayName: {
      type: String,
      default: null,
    },
    fullName: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    gen: {
      type: String,
      default: null,
    },
    birthday: {
      type: Date,
      default: null,
    },
    homeTown: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    school: {
      type: String,
      default: null,
    },
    studentId: {
      type: String,
      default: null,
    },
    className: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    mailSis: {
      type: String,
      default: null,
    },
    facebook: {
      type: String,
      default: null,
    },
    dateJoin: {
      type: Date,
      default: null,
    },
    dateOut: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('users', UserSchema);
