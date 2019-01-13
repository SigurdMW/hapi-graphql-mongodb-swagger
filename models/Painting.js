const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PaintinSchema = new Schema({
  name: String,
  url: String,
  techniques: String
})

module.exports = mongoose.model("Paintin", PaintinSchema)
