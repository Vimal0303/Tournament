import Player from "../models/player.js";
import PlayerTournamentMapping from "../models/playerTournamentMapping.js";
import Tournament from "../models/tournament.js";
import Validator from "validatorjs";

class PlayerController {
  /**
   * @name createPlayer
   * @file PlayerController.js
   * @param {Request} req
   * @param {Response} res
   * @description create player
   * @author Vimal Solanki
   */
  static createPlayer = async (req, res) => {
    try {
      // get data from req.body
      let playerData = {
        name: req.body.name,
        email: req.body.email,
        joiningDate: req.body.joiningDate,
      };

      // validation rules
      let rules = {
        name: "required",
        email: "required|string",
        joiningDate: "numeric",
      };

      // validate data
      let validation = new Validator(
        {
          name: playerData.name,
          email: playerData.email,
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

      // check if player with same name already exist or not
      let isPlayerExist = await Player.findOne({ email: playerData.email });

      // return if player already exist
      if (isPlayerExist) {
        return res.status(200).json({
          status: 400,
          msg: "Player already exist with this email!",
          data: {},
          err: "",
        });
      }

      // create player
      let newPlayer = await Player.create(playerData);
      await newPlayer.save();

      // return success
      return res.json({
        statusCode: 201,
        data: { newPlayer },
        message: "Player created sucessfully..",
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
   * @name listAllPlayer
   * @file PlayerController.js
   * @param {Request} req
   * @param {Response} res
   * @description list all players
   * @author Vimal Solanki
   */
  static listAllPlayer = async (req, res) => {
    try {
      // get filters from req.query
      const playerData = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        name: req.query.name,
        minTip: req.query.minTip,
        maxTip: req.query.maxTip,
        minBalance: req.query.minBalance,
        maxBalance: req.query.maxBalance,
        minWin: req.query.minWin,
        maxWin: req.query.maxWin,
      };

      // preparing obj for find players as per filters
      let filterObj = {};
      // filter by startDate
      if (playerData.startDate) {
        filterObj.joiningDate = {
          $gte: playerData.startDate,
        };
      }
      // filter by endDate
      if (playerData.endDate) {
        filterObj.joiningDate = {
          $lte: playerData.endDate,
        };
      }
      // filter by name
      if (playerData.name) {
        filterObj.$or = [{ name: playerData.name }, { email: playerData.name }];
      }
      // filter by minTip
      if (playerData.minTip) {
        filterObj.tip = {
          $gte: playerData.minTip,
        };
      }
      // filter by maxTip
      if (playerData.maxTip) {
        filterObj.tip = {
          $lte: playerData.maxTip,
        };
      }
      // filter by minBalance
      if (playerData.minBalance) {
        filterObj.balance = {
          $gte: playerData.minBalance,
        };
      }
      // filter by maxBalance
      if (playerData.maxBalance) {
        filterObj.balance = {
          $lte: playerData.maxBalance,
        };
      }
      // filter by minWin
      if (playerData.minWin) {
        filterObj.win = {
          $gte: playerData.minWin,
        };
      }
      // filter by maxWin
      if (playerData.maxWin) {
        filterObj.win = {
          $lte: playerData.maxWin,
        };
      }

      // get all players
      const players = await Player.find(filterObj);

      // return response
      return res.json({
        statusCode: 200,
        data: players,
        message: "players fetched sucessfully..",
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
   * @name updatePlayer
   * @file PlayerController.js
   * @param {Request} req
   * @param {Response} res
   * @description update player
   * @author Vimal Solanki
   */
  static updatePlayer = async (req, res) => {
    try {
      // get data from req.body
      let playerData = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        date: req.body.date,
      };

      // validation rules
      let rules = {
        id: "required|string",
        name: "string",
        email: "email",
        date: "numeric",
      };

      // validate data
      let validation = new Validator(
        {
          id: playerData.id,
          name: playerData.name,
          email: playerData.email,
          date: playerData.date,
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

      // check if player exist or not
      let playerExist = await Player.findOne({
        _id: playerData.id,
      });

      // if player not exist
      if (!playerExist) {
        return res.status(200).json({
          status: 400,
          msg: "Player not found",
          data: {},
          err: "",
        });
      }

      // check if player with same name already exist or not
      let isPlayerExist = await Player.findOne({
        _id: { $ne: playerData.id },
        email: playerData.email,
      });

      // return if player already exist
      if (isPlayerExist) {
        return res.status(200).json({
          status: 400,
          msg: "Player already exist with this email!",
          data: {},
          err: "",
        });
      }

      // update player
      let updatedPlayer = await Player.findOneAndUpdate(
        { _id: playerData.id },
        { $set: playerData },
        {new: true}
      );

      // return success
      return res.json({
        statusCode: 200,
        data: updatedPlayer,
        message: "Player updated sucessfully..",
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
   * @name deletePlayer
   * @file PlayerController.js
   * @param {Request} req
   * @param {Response} res
   * @description delete player
   * @author Vimal Solanki
   */
  static deletePlayer = async (req, res) => {
    try {
      // get data from req.body
      let playerData = {
        id: req.body.id,
      };

      // validation rules
      let rules = {
        id: "required|string",
      };
      // validate data
      let validation = new Validator(
        {
          id: playerData.id,
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

      // check if player exist or not
      let playerExist = await Player.findOneAndDelete({
        _id: playerData.id,
      });

      // if player not exist
      if (!playerExist) {
        return res.status(200).json({
          status: 400,
          msg: "Player not exist",
          data: {},
          err: "",
        });
      }

      // get all mapping data
      let allMappings = await PlayerTournamentMapping.find({ player : playerData.id });

      // decrease tip and win of tournament
      for (let i = 0; i < allMappings.length; i++) {
        // update tournament detail
				await Tournament.findOneAndUpdate(
					{ _id: allMappings[i].tournament },
					{
						$inc: {
							totalWin: -(allMappings[i].win),
							totalTip: -(allMappings[i].tip),
						},
						$pull: { players: allMappings[i].player },
					}
				);
        await PlayerTournamentMapping.findOneAndDelete({ _id: allMappings[i]._id });
      }

      // return success
      return res.json({
        statusCode: 200,
        data: {},
        message: "Player deleted sucessfully..",
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

export default PlayerController;
