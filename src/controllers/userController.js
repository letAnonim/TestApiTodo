const userValidation = require("../middleware/validationUser");
const userService = require("../services/userService");
const todoService = require("../services/todoService");



exports.registrationUser = async (req, res, next) => {
  try {
    const { error } = userValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let { name, age, email, password } = req.body;
    const userData = await userService.registrationUser(name, age, email, password);

    return res.json(userData);
  } catch (err) {
    next(err);
  }
}
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await userService.login(email, password);
    res.json(userData);
  } catch (err) {
    next(err);
  }
}

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const { email, password } = req.body;
    const userData = await userService.refresh(refreshToken);
    res.json(userData);
  } catch (err) {
    next(err);
  }
}

exports.getProfile = async (req, res, next) => {
  try {
    let { user } = req;
    let todos = await todoService.getTodo(user.id);
    res.json({ user, todos })
  } catch (err) {
    next(err);
  }
}

