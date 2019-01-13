const mongoose = require("mongoose")
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/hapi_db")

mongoose.connection.once("open", (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log("MONGODB CONNECTION OPEN")
  }
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))
