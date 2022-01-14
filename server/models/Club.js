import mongoose from 'mongoose';

const ClubSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        description: {
            type: String
        },
        chief: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        vice: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'users'
        },
        members: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'users'
        },
        reference: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('clubs', ClubSchema);
