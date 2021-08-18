const ApiError = require("../errors");
const todoService = require("../services/todoService");
exports.postTodo = async (req, res, next) => {
  try {
    let { user } = req;
    let { todos } = req.body;
    let userTodos = await todoService.createTodo(todos, user.id);
    res.json(userTodos);
  } catch (err) {
    next(err);
  }
}

exports.putTodo = async (req, res, next) => {
  try {
    let { user } = req;
    let { todos } = req.body;
    if (!todos) {
      throw ApiError.BadRequest("Not input todos for update");
    }
    let { newTodos } = await todoService.updateTodo(todos, user.id);
    res.json({ newTodos });
  } catch (err) {
    next(err);
  }
}
exports.deleteTodo = async (req, res, next) => {
  try {
    let { user } = req;
    let { todos } = req.body;
    if (!todos) {
      throw ApiError.BadRequest("Not input todos for delete");
    }
    let { newTodo, deleteTodos } = await todoService.deleteTodos(todos, user.id);
    res.json({ newTodo, delete: deleteTodos });
  } catch (err) {
    next(err);
  }
}