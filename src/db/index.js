const mongoose = require("mongoose");
const config = require("../config");
const optionDb = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}

mongoose.connect(config.db.connectUrl, optionDb).then(() => {
  console.log("DB is connected");
}).catch((err) => {
  console.log(err);
})

let User = require("./modules/user");
let todoUser = require("./modules/todo");
let token = require("./modules/token")

module.exports = {
  User,
  todoUser,
  token,
}