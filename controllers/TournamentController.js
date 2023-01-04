import Tournament from "../models/tournament.js";
import Validator from "validatorjs";
import PlayerTournamentMapping from "../models/playerTournamentMapping.js";
import Player from "../models/player.js";

class TournamentController {
  /**
   * @name createTournament
   * @file TournamentController.js
   * @param {Request} req
   * @param {Response} res
   * @description create tournament
   * @author Vimal Solanki
   */
  static createTournament = async (req, res) => {
    try {
      // get data from req.body
      let tournamentData = {
        name: req.body.name,
        date: req.body.date,
      };

      // validation rules
      let rules = {
        name: "required|string",
        date: "required|numeric",
      };

      // validate data
      let validation = new Validator(
        {
          name: tournamentData.name,
          date: tournamentData.date,
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

      // check if tournament with same name already exist or not
      let isTournamentExist = await Tournament.findOne({
        name: tournamentData.name,
      });

      // return if tournament already exist
      if (isTournamentExist) {
        return res.status(200).json({
          status: 400,
          msg: "Tournament already exist with this email!",
          data: {},
          err: "",
        });
      }

      // create tournament
      let newTournament = await Tournament.create(tournamentData);
      await newTournament.save();

      // return success
      return res.json({
        statusCode: 201,
        data: { newTournament },
        message: "Tournament created sucessfully..",
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
   * @name listAllTournaments
   * @file TournamentController.js
   * @param {Request} req
   * @param {Response} res
   * @description list all tournaments
   * @author Vimal Solanki
   */
  static listAllTournaments = async (req, res) => {
    try {
      // get filters from req.query
      const tournamentData = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        name: req.query.name,
        minTip: req.query.minTip,
        maxTip: req.query.maxTip,
      };

      // preparing obj for find tournaments as per filters
      let filterObj = {};
      // filter by startDate
      if (tournamentData.startDate) {
        filterObj.date = {
          $gte: tournamentData.startDate,
        };
      }
      // filter by endDate
      if (tournamentData.endDate) {
        filterObj.date = {
          $lte: tournamentData.endDate,
        };
      }
      // filter by name
      if (tournamentData.name) {
        filterObj.name = tournamentData.name;
      }
      // filter by minTip
      if (tournamentData.minTip) {
        filterObj.totalTip = {
          $gte: tournamentData.minTip,
        };
      }
      // filter by maxTip
      if (tournamentData.maxTip) {
        filterObj.totalTip = {
          $lte: tournamentData.maxTip,
        };
      }

      // get all tournaments
      let tournaments = await Tournament.find(filterObj);

      let associated = [];
      for (let i = 0; i < tournaments.length; i++) {
        let tournament = tournaments[i];
        let mappingData = await PlayerTournamentMapping.find({ tournament: tournament._id }).select({ _id: 1, win: 1, tip: 1, player: 1 }).populate('player');
        associated.push({...tournament._doc,players:mappingData});
      }

      // return success
      return res.json({
        statusCode: 201,
        data: associated,
        message: "Tournaments fetched sucessfully..",
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
   * @name updateTournament
   * @file TournamentController.js
   * @param {Request} req
   * @param {Response} res
   * @description update tournament
   * @author Vimal Solanki
   */
  static updateTournament = async (req, res) => {
    try {
      // get data from req.body
      let tournamentData = {
        id: req.body.id,
        name: req.body.name,
        date: req.body.date,
      };

      // validation rules
      let rules = {
        id: "required|string",
        name: "string",
        date: "numeric",
      };

      // validate data
      let validation = new Validator(
        {
          id: tournamentData.id,
          name: tournamentData.name,
          date: tournamentData.date,
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

      // check if tournament exist or not
      let tournamentExist = await Tournament.findOne({
        _id: tournamentData.id,
      });

      // if tournament not exist
      if (!tournamentExist) {
        return res.status(200).json({
          status: 400,
          msg: "Tournament not found",
          data: {},
          err: "",
        });
      }

      // check if tournament with same name already exist or not
      let isTournamentExist = await Tournament.findOne({
        _id: { $ne: tournamentData.id },
        name: tournamentData.name,
      });

      // return if tournament already exist
      if (isTournamentExist) {
        return res.status(200).json({
          status: 400,
          msg: "Tournament already exist with this name!",
          data: {},
          err: "",
        });
      }

      // update tournament
      let updatedTournament = await Tournament.findOneAndUpdate(
        { _id: tournamentData.id },
        { $set: tournamentData },
        {new: true},
      );

      // return success
      return res.json({
        statusCode: 200,
        data: updatedTournament,
        message: "Tournament updated sucessfully..",
      });
    } catch (error) {
      console.log("error :: ", error);
      return res.json({
        statusCode: 500,
        data: {},
        message: error.toString(),
      });
    }
  };

  /**
   * @name deleteTournament
   * @file TournamentController.js
   * @param {Request} req
   * @param {Response} res
   * @description delete tournament
   * @author Vimal Solanki
   */
  static deleteTournament = async (req, res) => {
    try {
      // get data from req.body
      let tournamentData = {
        id: req.body.id,
      };

      // validation rules
      let rules = {
        id: "required|string",
      };
      // validate data
      let validation = new Validator(
        {
          id: tournamentData.id,
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

      // check if tournament exist or not
      let tournamentExist = await Tournament.findOneAndDelete({
        _id: tournamentData.id,
      });

      // if tournament not exist
      if (!tournamentExist) {
        return res.status(200).json({
          status: 400,
          msg: "Tournament not exist",
          data: {},
          err: "",
        });
      }

      // get all mapping data
      let allMappings = await PlayerTournamentMapping.find({ tournament : tournamentData.id });

      // decrease tip and win of players
      for (let i = 0; i < allMappings.length; i++) {
        // update player detail
				await Player.findOneAndUpdate(
					{ _id: allMappings[i].player },
					{
						$inc: {
							win: -(allMappings[i].win),
							tip: -(allMappings[i].tip),
						},
						$pull: { tournaments: allMappings[i].tournament },
					}
				);
        await PlayerTournamentMapping.findOneAndDelete({ _id: allMappings[i]._id });
      }

      // return success
      return res.json({
        statusCode: 200,
        data: {},
        message: "Tournament deleted sucessfully..",
      });
    } catch (error) {
      console.log("error :: ", error);
      return res.json({
        statusCode: 500,
        data: {},
        message: error.toString(),
      });
    }
  };

}

export default TournamentController;
