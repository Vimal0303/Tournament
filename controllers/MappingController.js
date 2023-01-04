import Player from '../models/player.js';
import Tournament from '../models/tournament.js';
import PlayerTournamentMapping from '../models/playerTournamentMapping.js';
import Validator from 'validatorjs';

class MappingController {
	/**
	 * @name assignPlayer
	 * @file MappingController.js
	 * @param {Request} req
	 * @param {Response} res
	 * @description assign player to the tournaments
	 * @author Vimal Solanki
	 */
	static assignPlayer = async (req, res) => {
		try {
			// get data from req.body
			let playerData = {
				player: req.body.player,
				win: req.body.win,
				tip: req.body.tip,
				tournament: req.body.tournament,
			};

			// validation rules
			let rules = {
				player: 'required|string',
				win: 'numeric',
				tip: 'numeric',
				tournament: 'required|string',
			};
			// validate data
			let validation = new Validator(
				{
					player: playerData.player,
					win: playerData.win,
					tip: playerData.tip,
					tournament: playerData.tournament,
				},
				rules
			);
			if (!validation.passes()) {
				return res.status(400).json({
					statusCode: 400,
					data: {},
					errors: validation.errors.errors,
				});
			}

			// check if player and tournament both are exist or not
			let tournament = await Tournament.findOne({ _id: playerData.tournament });
			let player = await Player.findOne({ _id: playerData.player });

			// if tournament or player not exist
			if (!tournament || !player) {
				return res.status(200).json({
					status: 400,
					msg: 'Player or Tournament are not exist',
					data: {},
					err: '',
				});
			}

			// check if player already assigned or not
			let mappingExist = await PlayerTournamentMapping.find({
				player: player._id,
				tournament: tournament._id,
			});
			// return if player already exist
			if (mappingExist.length) {
				return res.status(200).json({
					status: 400,
					msg: 'Player already exist in this tournament!',
					data: {},
					err: '',
				});
			}

			// create playerTournament
			let newAssign = await PlayerTournamentMapping.create(playerData);
			await newAssign.save();

			// update tournament detail
			if (newAssign) {
				await Tournament.findOneAndUpdate(
					{ _id: newAssign.tournament },
					{
						$set: {
							totalWin: tournament.totalWin + playerData.win,
							totalTip: tournament.totalTip + playerData.tip,
						},
						$push: { players: player._id },
					}
				);

				// update player detail
				await Player.findOneAndUpdate(
					{ _id: newAssign.player },
					{
						$set: {
							win: player.win + playerData.win,
							tip: player.tip + playerData.tip,
							balance: player.balance + playerData.tip + playerData.win,
						},
						$push: { tournaments: tournament._id },
					}
				);
			}

			// return success
			return res.json({
				statusCode: 201,
				data: newAssign,
				message: 'Player assigned sucessfully..',
			});
		} catch (error) {
			return res.json({
				statusCode: 500,
				data: {},
				message: error.toString(),
			});
		}
	};

	/**
	 * @name removePlayer
	 * @file MappingController.js
	 * @param {Request} req
	 * @param {Response} res
	 * @description remove player from tournament
	 * @author Vimal Solanki
	 */
	static removePlayer = async (req, res) => {
		try {
			// get data from req.body
			let playerData = {
				player: req.body.player,
				tournament: req.body.tournament,
			};

			// validation rules
			let rules = {
				player: 'required|string',
				tournament: 'required|string',
			};
			// validate data
			let validation = new Validator(
				{
					player: playerData.player,
					tournament: playerData.tournament,
				},
				rules
			);
			if (!validation.passes()) {
				return res.status(400).json({
					statusCode: 400,
					data: {},
					errors: validation.errors.errors,
				});
			}

			// check if player and tournament both are exist or not
			let tournament = await Tournament.findOne({ _id: playerData.tournament });
			let player = await Player.findOne({ _id: playerData.player });

			// if tournament or player not exist
			if (!tournament || !player) {
				return res.status(200).json({
					status: 400,
					msg: 'Player or Tournament are not exist',
					data: {},
					err: '',
				});
			}

			// check if player already assigned or not
			let mappingExist = await PlayerTournamentMapping.find({
				player: player._id,
				tournament: tournament._id,
			});
			// return if player already exist
			if (!mappingExist.length) {
				return res.status(200).json({
					status: 400,
					msg: "Player not exist in this tournament",
					data: {},
					err: "",
				});
			}

			// delete player from tournament
			let removedPlayer = await PlayerTournamentMapping.findOneAndDelete(
				playerData
			);

			// update tournament detail
			if (removedPlayer) {
				await Tournament.findOneAndUpdate(
					{ _id: removedPlayer.tournament },
					{
						$set: {
							totalWin: tournament.totalWin - removedPlayer.win,
							totalTip: tournament.totalTip - removedPlayer.tip,
						},
						$pull: { players: player._id },
					}
				);

				// update player detail
				await Player.findOneAndUpdate(
					{ _id: removedPlayer.player },
					{
						$set: {
							win: player.win - removedPlayer.win,
							tip: player.tip - removedPlayer.tip,
							balance: player.balance - (removedPlayer.tip + removedPlayer.win),
						},
						$pull: { tournaments: tournament._id },
					}
				);
			}

			// return success
			return res.json({
				statusCode: 200,
				data: removedPlayer || {},
				message: 'Player removed sucessfully..',
			});
		} catch (error) {
			return res.json({
				statusCode: 500,
				data: {},
				message: error.toString(),
			});
		}
	};
}

export default MappingController;
