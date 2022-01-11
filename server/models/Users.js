import mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema({});

export default mongoose.model('users', UsersSchema);
