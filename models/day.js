const mongoose = require("mongoose");

const Schema = mongoose.Schema
const daySchema = Schema({
 Day: { type: Number },
 FinancialIncome: { type: Number },
 FinancialExit: { type: Number },
 CreatedAt: { type: Date, default: Date.now },
});

const Day = mongoose.model("Day", daySchema);
module.exports = Day;
