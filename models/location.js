const mongoose = require("mongoose");

const Schema = mongoose.Schema
const locationSchema = Schema({

   PositionLatitude: { type: Number},
   PositionLongitude: { type: Number },
   createdAt: { type: Date, default: Date.now },
   client: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  }
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
 