require("dotenv").config();

module.exports = {
  app: {
    port: process.env.PORT
  },
  db: {
    connectUrl: process.env.DB_CONNECT
  },
  token_: {
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
    salt_round: 10,
  }
}