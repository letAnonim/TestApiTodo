const { User } = require("../../db");
const bcrypt = require("bcrypt");
const config = require("../../config");
const tokenService = require("../tokenService");
const UserDto = require("../../dtos/user-dto");
const ApiError = require("../../errors");
const mailer = require("../../helpers/mailer");
const uuid = require("uuid");

exports.registrationUser = async (name, age, email, password) => {
  const candidate = await User.findOne({ email: email });
  if (candidate) {
    throw ApiError.BadRequest("User already create");
  }
  const hashPassword = await bcrypt.hash(password, config.token_.salt_round);
  const activationLink = uuid.v4();
  const user = await User.create({
    name,
    age,
    email,
    password: hashPassword,
    activationLink,
  })
  const userDto = UserDto(user); //id,name,age,email
  const tokens = tokenService.generateToken({
    id: userDto.id,
    name: userDto.name,
    age: userDto.age,
    email: userDto.email,
  });

  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  mailer({
    to: userDto.email,
    subject: "Congratulation you successfully registration on Test Api site",
    html: `
      <form action="http://127.0.0.1:3000/user/activation/${activationLink}" method = "GET">
        <p><input type="submit" value=" Activation account "></p>
      </form>
    `
  })
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
  if (user.isActivated === false) {
    throw ApiError.BadRequest("Not activated email");
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

exports.activationEmail = async (activationLink) => {
  let user = await User.findOne({ activationLink });
  if (user) {
    user.isActivated = true;
    await user.save();
    let { _id } = user;
    return {
      id: _id,
      isActivated: true,
    };
  }
  return false;
}