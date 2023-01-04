import mongoose from 'mongoose';

//definig schema
const productschema = new mongoose.Schema(
	{
		name: { type: String, required: [true, 'Provide valid Name'] },
		date: { type: Number },
		totalWin: {
			type: Number,
            default: 0,
		},
		totalTip: {
			type: Number,
            default: 0,
		},
		players: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'player',
			},
		],
	},
	{ timestamps: true, versionKey: false }
);

//create model
const TournamentModel = mongoose.model('tournament', productschema);

export default TournamentModel;
