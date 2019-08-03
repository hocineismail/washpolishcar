const mongoose = require("mongoose");

const Schema = mongoose.Schema
const citySchema = Schema({
 City: { type: String},
 CreatedAt: { type: Date, default: Date.now },

});

const City = mongoose.model("City", citySchema);
module.exports = City;
