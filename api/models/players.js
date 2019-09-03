const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model("Player", playerSchema);
