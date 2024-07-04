const { env } = require("process");

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7108';

const PROXY_CONFIG = [
  {
    context: ["^/api"],
    target,
    secure: false, // ignore lack of SSL cert
    changeOrigin: true, // prevents CORs
    logLevel: "debug",
  },
];

module.exports = PROXY_CONFIG;
