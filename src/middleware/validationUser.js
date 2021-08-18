const Joi = require("joi");

module.exports = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    age: Joi.number().min(1).max(120).required(),
    email: Joi.string().min(4).max(50).email().required(),
    password: Joi.string().min(5).max(1024).required(),
  })

  return schema.validate(data);
}