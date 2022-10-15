import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    chief: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    enrolledMembers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'users',
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'users',
    },
    reference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('events', EventSchema);
