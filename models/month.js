const mongoose = require("mongoose");

const Schema = mongoose.Schema
const monthSchema = Schema({
 Month: { type: Number },
 FinancialIncomeMonth: { type: Number },
 FinancialExitMonth: { type: Number },
 CreatedAt: { type: Date, default: Date.now },
 day: [{
    type: Schema.Types.ObjectId,
    ref: 'Day'
  }],
});

const Month = mongoose.model("Month", monthSchema);
module.exports = Month;
