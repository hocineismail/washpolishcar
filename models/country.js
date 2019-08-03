const mongoose = require("mongoose");

const Schema = mongoose.Schema
const countrySchema = Schema({
 Country: { type: String},
 CreatedAt: { type: Date, default: Date.now },
 city: [{
    type: Schema.Types.ObjectId,
    ref: 'City'
  }],

});

const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
