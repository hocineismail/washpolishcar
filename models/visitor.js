const mongoose = require("mongoose");

const Schema = mongoose.Schema
const visitorSchema = Schema({
 Visitor: { type: Number },
 IsExist: { type: Boolean, default: true },
 CreatedAt: { type: Date, default: Date.now },
});

const Visitor = mongoose.model("Visitor", visitorSchema);
module.exports = Visitor;
