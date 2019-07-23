const mongoose = require("mongoose");

const Schema = mongoose.Schema
const clientSchema = Schema({
 Bio: { type: String },
 Address: {type: String, required: true  },
 Country: {type: String,  required: true },
 City: {type: String,  required: true },
 Phone: {type: Number,  required: true },
 TypeOfStore: {Type: Boolean   },
 CreatedAt: { type: Date, default: Date.now },
 evaluation: [{
    type: Schema.Types.ObjectId,
    ref: 'Evaluation'
  }],
 image: [{
    type: Schema.Types.ObjectId,
    ref: 'Image'
  }],
 location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }
});

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
