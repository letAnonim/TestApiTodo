const { Schema, model } = require("mongoose");

const todoSchema = new Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  }
})
const todoUserSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  todos: [todoSchema],
})

module.exports = model("ToDo", todoUserSchema)