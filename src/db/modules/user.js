const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
  },
  age: {
    type: Number,
    min: 1,
    max: 120,
    required: true,
  },
  email: {
    type: String,
    minlength: 4,
    maxlength: 50,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  activationLink: {
    type: String
  },
  isActivated: {
    type: Boolean,
    default: false,
  }
})

module.exports = model("User", userSchema);