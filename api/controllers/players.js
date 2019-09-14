const playerModel = require("../models/players");
const fs = require("fs");
const mongoose = require("mongoose");

module.exports = {
  getById: async (req, res, next) => {
    try {
      let playerInfo = await playerModel.findById(req.params.playerId);
      playerInfo
        ? res.status(200).json({
            status: "success",
            message: "Player found!!!",
            data: { players: playerInfo }
          })
        : res.status(400).json({
            status: "Error",
            message: "Player not found!!!",
            data: { players: playerInfo }
          });
    } catch (err) {
      next(err);
    }
  },

  getAll: function(req, res, next) {
    let playersList = [];
    try {
      let players = playerModel.find({});
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
    } catch (err) {
      next(err);
    }
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
    //use the fs object's rename method to re-name the file
    fs.rename(req.file.path, req.file.path + ".jpg", function(err) {
      if (err) {
        console.log(err);
        return;
      }

      console.log("The file has been re-named to: " + req.file.path + ".jpg");
    });
    let fileExt = "";
    if (req.file.mimetype === "image/jpeg") {
      fileExt = ".jpg";
    } else if (req.file.mimetype === "image/png") {
      fileExt = ".png";
    }
    const player = new playerModel({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      image: req.file.path + fileExt
    });
    player
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Created player successfully"
          // createdPlayer: {
          //     name: result.name,
          //     _id: result._id,
          //     // request: {
          //     //     type: 'GET',
          //     //     url: "http://localhost:5000/api/players/" + result._id
          //     // }
          // }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
};
