const mongoose = require("mongoose");

const Schema = mongoose.Schema
const locationSchema = Schema({

   PositionLatitude: { type: Number, requered},
   PositionLongitude: { type: Number, requered },
   createdAt: { type: Date, default: Date.now },
   client: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  }
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
 