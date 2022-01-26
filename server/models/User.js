import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        positions: {
            type: [String],
            default: ['member']
        },
        firstName: {
            type: String,
            default: null
        },
        fullName: {
            type: String,
            default: null
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: true
        },
        birthday: {
            type: Date,
            default: null
        },
        homeTown: {
            type: String,
            default: null
        },
        address: {
            type: String,
            default: null
        },
        school: {
            type: String,
            default: null
        },
        studentId: {
            type: String,
            default: null
        },
        phoneNumber: {
            type: String,
            default: null
        },
        email: {
            type: String,
            default: null
        },
        mailSis: {
            type: String,
            default: null
        },
        facebook: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('users', UserSchema);
