module.exports = {
  "@logLevel": "debug",
  mongodb: {
    "@host:MONGO_DB": "localhost",
    port: 27017,
    database: "rsp-boilerplate",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  "@graphiql:IS_DEV": "true",
}
