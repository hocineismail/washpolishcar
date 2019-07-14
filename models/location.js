const mongoose = require("mongoose");

const Schema = mongoose.Schema
const locationSchema = Schema({
 
  //Set the information of map
  // let: { type: number, requered},
  //let: { type: number, requered },
 createdAt: { type: Date, default: Date.now },
 location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
