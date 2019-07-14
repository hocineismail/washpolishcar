const mongoose = require("mongoose");

const Schema = mongoose.Schema
const imageSchema = Schema({
 UrlImage: { type: String ,require},
 CreatedAt: { type: Date, default: Date.now },
});

const Image = mongoose.model("image", imageSchema);
module.exports = Image;
