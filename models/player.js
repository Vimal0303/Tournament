import mongoose from 'mongoose';

//definig schema
const playerSchema = new mongoose.Schema(
	{
		name: { type: String, required: [true, 'Provide valid Name'] },
		email: { type: String, required: [true, 'Provide valid Email'] },
		joiningDate: { type: Number },
		tip: {
			type: Number,
			default: 0,
		},
		win: {
			type: Number,
			default: 0,
		},
		balance: {
			type: Number,
			default: 0,
		},
		tournaments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'tournament',
			},
		],
	},
	{ timestamps: true, versionKey: false }
);

//create model
const Player = mongoose.model('player', playerSchema);

export default Player;
