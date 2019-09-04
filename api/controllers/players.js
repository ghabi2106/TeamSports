const playerModel = require("../models/players");
const fs = require('fs');
const mongoose = require("mongoose");

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
    //use the fs object's rename method to re-name the file
    fs.rename(req.file.path, req.file.path + ".jpg", function(err) {
      if (err) {
        console.log(err);
        return;
      }

      console.log("The file has been re-named to: " + req.file.path + ".jpg");
    });
    const player = new playerModel({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      image: req.file.path + ".jpg"
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
