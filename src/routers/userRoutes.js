const userController = require("../controllers/userController");
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");


module.exports = (app) => {
  app.post("/user/registraion", userController.registrationUser);
  app.post("/user/login", userController.loginUser);
  app.get("/user/refresh", userController.refresh);//i think this not work, but i trying
  app.get("/user/profile", authMiddleware, userController.getProfile);
  app.get("/user/activation/:activationLink", userController.activationEmail);
  app.post("/user/profile/todo", authMiddleware, todoController.postTodo);
  app.put("/user/profile/todo", authMiddleware, todoController.putTodo);
  app.delete("/user/profile/todo", authMiddleware, todoController.deleteTodo);

  app.get("/", (req, res) => {
    res.send("Index page");
  })
}