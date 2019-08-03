const mongoose = require("mongoose");

const Schema = mongoose.Schema
const zoneSchema = Schema({
 Zone: { type: String},
 CreatedAt: { type: Date, default: Date.now },
 country: [{
    type: Schema.Types.ObjectId,
    ref: 'Country'
  }],

});

const Zone = mongoose.model("Zone", zoneSchema);
module.exports = Zone;
