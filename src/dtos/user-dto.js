module.exports = function (model) {
  return {
    id: model._id,
    name: model.name,
    email: model.email,
    age: model.age,
  }
}