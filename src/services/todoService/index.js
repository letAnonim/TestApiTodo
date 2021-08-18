const { todoUser, User } = require("../../db");
const ApiError = require("../../errors");

exports.getTodo = async (userId) => {
  let userTodos = await todoUser.findOne({ userId });
  return userTodos.todos;
}
exports.createTodo = async (todos, userId) => {
  let user = await User.findById({ _id: userId });
  if (!user) {
    throw ApiError.UnauthorizedError();
  }
  let userTodos = await todoUser.findOne({ userId });
  if (userTodos) {
    let resTodos = [];
    let notAddTodos = [];
    for (let todoAdd of todos) {
      let inThere = false;
      for (let todoBd of userTodos.todos) {
        if (todoBd.name === todoAdd.name) {
          inThere = true;
          break;
        }
      }
      if (!inThere) {
        resTodos.push(todoAdd);
      } else {
        notAddTodos.push(todoAdd);
      }
    }
    resTodos.forEach((todo) => userTodos.todos.push(todo));
    await userTodos.save();
    return {
      saveTodos: resTodos,
      notSaveTodos: notAddTodos,
    }
  }
  let newUserTodo = new todoUser({
    userId: userId,
    todos: todos,
  });
  await newUserTodo.save();
  return {
    saveTodos: todos
  }
}

exports.updateTodo = async (updateTodos, userId) => {
  let userTodo = await todoUser.findOne({ userId });
  if (!userTodo) {
    throw ApiError.BadRequest("User todos not found for update");
  }
  for (let i = 0; updateTodos.length > i; i++) {
    for (let j = 0; userTodo.todos.length > j; j++) {
      if (`${updateTodos[i]._id}` === `${userTodo.todos[j]._id}`) {
        userTodo.todos[j] = updateTodos[i];
        break;
      }
    }
  }
  await userTodo.save();

  return {
    newTodos: userTodo.todos,
  }

}

exports.deleteTodos = async (todos, userId) => {
  if (!todos) {
    throw ApiError.BadRequest("Not input todos for delete");
  }
  let userTodos = await todoUser.findOne({ userId });
  if (!userTodos) {
    throw ApiError.BadRequest("Todos not found for delete");
  }
  let deleteTodos = [];
  for (let i = 0; todos.length > i; i++) {
    for (let j = 0; userTodos.todos.length > j; j++) {
      if (`${todos[i]._id}` === `${userTodos.todos[j]._id}`) {
        deleteTodos.push(userTodos.todos[j]);
        userTodos.todos.splice(j, 1);
        break;
      }
    }
  }
  await userTodos.save();

  return {
    newTodo: userTodos.todos,
    deleteTodos,
  }
}