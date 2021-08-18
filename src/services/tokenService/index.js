const jwt = require("jsonwebtoken");
const { token_ } = require("../../config");
const { token } = require("../../db");

exports.generateToken = (payload) => {
  const accessToken = jwt.sign(payload, token_.access_token, { expiresIn: "30d" });
  const refreshToken = jwt.sign(payload, token_.refresh_token, { expiresIn: "30d" });
  return {
    accessToken,
    refreshToken
  }
}

exports.validateAccessToken = (token) => {
  try {
    const userData = jwt.verify(token, token_.access_token);
    return userData;
  } catch (err) {
    return null;
  }
}

exports.validateRefreshToken = (token) => {
  try {
    const userData = jwt.verify(token, token_.refresh_token);
    return userData;
  } catch (err) {
    return null;
  }
}

exports.saveToken = async (userId, refreshToken) => {
  const tokenData = await token.findOne({ userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const resultToken = await token.create({ userId, refreshToken });
  return resultToken;
}

exports.removeToken = async (refreshToken) => {
  const tokenData = await token.deleteOne({ refreshToken });
  return tokenData;
}

exports.findToken = async (refreshToken) => {
  const tokenData = await token.findOne({ refreshToken });
  return tokenData;
}