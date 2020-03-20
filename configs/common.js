const path = require("path")

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
  gCloudStorage: {
    "@bucket:GCLOUD_BUCKET_NAME": "covid-19-spree",
  },
  imagePath: process.env.IMAGE_PATH || path.resolve(__dirname, "../image_tmp"),
  "@fbAppSecret:FB_APP_SECRET": "372eadb5d30767f287c1746ad55a4748",
  "@graphiql:IS_DEV": "true",
}
