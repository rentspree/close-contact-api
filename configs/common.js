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
  fcm: {
    "@endpoint:FCM_ENDPOINT": "https://fcm.googleapis.com/fcm/send",
    "@serverKey:FCM_SERVER_KEY":
      "AAAAnaRVg2o:APA91bHc6sr-mTgKejgzahwtXKw3pQVEEvbtelKLs6UFEvrVOEN8lRP8iz-s6Mof6avzwjNaIZIgY4mPpn0Ie6f0QdiWFgNsxEyc_r4hX5x9cNT7ceTVBFLVMrkRvBikio5Jg2qWQnyK",
  },
}
