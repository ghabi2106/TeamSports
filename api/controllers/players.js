const playerModel = require("../models/players");

module.exports = {
  getById: function(req, res, next) {
    console.log(req.body);
    playerModel.findById(req.params.playerId, function(err, playerInfo) {
      if (err) {
        next(err);
      } else {
        res.json({
          status: "success",
          message: "Player found!!!",
          data: { players: playerInfo }
        });
      }
    });
  },

  getAll: function(req, res, next) {
    let playersList = [];

    playerModel.find({}, function(err, players) {
      if (err) {
        next(err);
      } else {
        for (let player of players) {
          playersList.push({
            id: player._id,
            name: player.name,
            released_on: player.released_on
          });
        }
        res.json({
          status: "success",
          message: "Players list found!!!",
          data: { players: playersList }
        });
      }
    });
  },

  updateById: function(req, res, next) {
    playerModel.findByIdAndUpdate(
      req.params.playerId,
      { name: req.body.name },
      function(err, playerInfo) {
        if (err) next(err);
        else {
          res.json({
            status: "success",
            message: "Player updated successfully!!!",
            data: null
          });
        }
      }
    );
  },

  deleteById: function(req, res, next) {
    playerModel.findByIdAndRemove(req.params.playerId, function(
      err,
      playerInfo
    ) {
      if (err) next(err);
      else {
        res.json({
          status: "success",
          message: "Player deleted successfully!!!",
          data: null
        });
      }
    });
  },

  create: function(req, res, next) {
  }
};
