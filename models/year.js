const mongoose = require("mongoose");

const Schema = mongoose.Schema
const yearSchema = Schema({
 Year: { type: Number },
 FinancialIncome: { type: Number },
 FinancialExit: { type: Number },
 CreatedAt: { type: Date, default: Date.now },
 month: [{
    type: Schema.Types.ObjectId,
    ref: 'Month'
  }],
});

const Year = mongoose.model("Year", yearSchema);
module.exports = Year;
