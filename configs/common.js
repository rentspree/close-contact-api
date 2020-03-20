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
}
