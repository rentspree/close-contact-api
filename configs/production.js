const senecaTimeout = parseInt(process.env.SENECA_TIMEOUT, 10) || 30000
module.exports = {
  mongodb: {
    options: {
      autoIndex: false,
    },
  },
  transports: {
    "@type:TRANSPORT_TYPE": "mesh",
    listenings: [
      {
        type: "http",
        port: "8000",
        timeout: senecaTimeout,
        pins: [{ role: "boilerplate", cmd: "*" }],
      },
    ],
  },
  seneca_config: {
    timeout: senecaTimeout,
  },
  "@logLevel": "error",
}
