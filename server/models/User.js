import mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema(
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
        position: {
            type: [String],
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        fullName: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: true
        },
        birthday: {
            type: Date,
            required: true
        },
        homeTown: {
            type: String,
            required: true
        },
        address: {
            type: String
        },
        school: {
            type: String,
            required: true
        },
        studentId: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        facebook: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('users', UsersSchema);
