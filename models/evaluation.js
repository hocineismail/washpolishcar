const mongoose = require("mongoose");

const Schema = mongoose.Schema
const evaluationSchema = Schema({
 evaluation: { type: Number ,require},
 Comment: { type: String},
 CreatedAt: { type: Date, default: Date.now },

});

const Evaluation = mongoose.model("Evaluation", evaluationSchema);
module.exports = Evaluation;
