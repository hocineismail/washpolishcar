const mongoose = require("mongoose");

const Schema = mongoose.Schema
const clientSchema = Schema({
 ImageUrl:{ type: String },
 Address: { type: String  },
 Phone: { type: Number },
 Star: { type: Number, default: 0 },
 thestore: { type: String  },
 username: { type: String  },
 MunicipalLicense: {Type: Date},
 CommercialRegister: {Type: Date},
 
 CreatedAt: { type: Date, default: Date.now },

 evaluation: [{
  type: Schema.Types.ObjectId,
  ref: 'Evaluation'
}],

 country: {
  type: Schema.Types.ObjectId,
  ref: 'Country'
},
 zone: {
  type: Schema.Types.ObjectId,
  ref: 'Zone'
},
 city: {
  type: Schema.Types.ObjectId,
  ref: 'City'
},
 year: [{
    type: Schema.Types.ObjectId,
    ref: 'Year'
  }],
 
 location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }
});

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
