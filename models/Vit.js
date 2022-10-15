import mongoose from 'mongoose';

const VitSchema = new mongoose.Schema(
    {
        fullVietnameseName: {
            type: String,
            required: true
        },
        fullEnglishName: {
            type: String,
            required: true
        },
        shorthandName: {
            type: String,
            required: true
        },
        celebrationDay: {
            type: Date,
            required: true
        },
        facebook: {
            type: String
        },
        email: {
            type: String
        },
        reference: {
            type: String
        },
        description: {
            type: String
        },
        captain: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        viceCaptain: {
            type: [mongoose.Schema.Types.ObjectId]
        }
    },
    {
        collection: 'vit'
    },
    {
        timestamps: true
    }
);

export default mongoose.model('vit', VitSchema);