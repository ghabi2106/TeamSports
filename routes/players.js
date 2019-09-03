const express = require("express");
const router = express.Router();
const playerController = require("../api/controllers/players");
const upload = require('../middleware/upload');

const mongoose = require("mongoose");
const Player = require("../api/models/players");
const fs = require('fs')
router.post("/", upload.single('image'), (req, res, next) => {
    const player = new Player({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      image: req.file.path 
    });
    player
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Created player successfully",
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
  });

router.get("/", playerController.getAll);
// router.post("/", playerController.create);
router.get("/:playerId", playerController.getById);
router.put("/:playerId", playerController.updateById);
router.delete("/:playerId", playerController.deleteById);

module.exports = router;
