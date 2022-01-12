import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true
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

export default mongoose.model('groups', GroupSchema);
