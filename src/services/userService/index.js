const { User} = require("../../db");
const bcrypt = require("bcrypt");
const config = require("../../config");
const tokenService = require("../tokenService");
const UserDto = require("../../dtos/user-dto");
const ApiError = require("../../errors");

exports.registrationUser = async (name, age, email, password) => {
  const candidate = await User.findOne({ email: email });
  if (candidate) {
    throw ApiError.BadRequest("User already create");
  }
  const hashPassword = await bcrypt.hash(password, config.token_.salt_round);
  const user = await User.create({
    name: name,
    age: age,
    email: email,
    password: hashPassword,
  })
  const userDto = UserDto(user); //name,age,email
  const tokens = tokenService.generateToken({
    id: userDto.id,
    name: userDto.name,
    age: userDto.age,
    email: userDto.email,
  });

  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userDto };
}

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.BadRequest("User by email not found");
  }

  const isPassEquals = await bcrypt.compare(password, user.password);
  if (!isPassEquals) {
    throw ApiError.BadRequest("Not currect password");
  }
  const userDto = UserDto(user);
  const tokens = tokenService.generateToken({ ...userDto });
  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userDto };
}

exports.refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }

  const userData = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDb = await tokenService.findToken(refreshToken);
  if (!userData || !tokenFromDb) {
    throw ApiError.UnauthorizedError();
  }
  let user = await User.findById(userData.id);
  const userDto = UserDto(user);
  const tokens = tokenService.generateToken({ ...userDto });
  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userDto };
}