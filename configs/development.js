const senecaTimeout = parseInt(process.env.SENECA_TIMEOUT, 10) || 30000
module.exports = {
  transports: {
    listenings: [
      {
        type: "http",
        port: "8012",
        host: "localhost",
        timeout: senecaTimeout,
        pins: [{ role: "boilerplate", cmd: "*" }],
      },
    ],
  },
  seneca_config: {
    timeout: senecaTimeout,
  },
}
