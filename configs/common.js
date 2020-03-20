module.exports = {
  "@logLevel": "debug",
  mongodb: {
    "@host:MONGO_DB": "localhost",
    port: 27017,
    database: "close-contact",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  accessToken: {
    "@expiresIn:ACCESS_TOKEN_EXPIRES_MS": 600000000,
  },
  refreshToken: {
    "@expiresIn:REFRESH_TOKEN_EXPIRES_MS": 2600000000,
  },
}
