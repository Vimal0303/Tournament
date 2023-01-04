import mongoose from "mongoose";

//definig schema
const playerTournamentSchema = new mongoose.Schema(
  {
    tip: {
      type: Number,
      default: 0,
    },
    win: {
      type: Number,
      default: 0,
    },
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tournament",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "player",
    },
  },
  { timestamps: true, versionKey: false }
);

//create model
const PlayerTournamentMapping = mongoose.model("playertournamentmapping", playerTournamentSchema);

export default PlayerTournamentMapping;
