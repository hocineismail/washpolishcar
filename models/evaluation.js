const mongoose = require("mongoose");

const Schema = mongoose.Schema
const evaluationSchema =  mongoose.Schema({
 evaluations: { type: Number, default: 0 },
 Comment: { type: String},
 CreatedAt: { type: Date, default: Date.now },

});

var Evaluation = mongoose.model("Evaluation", evaluationSchema);
module.exports = Evaluation;
