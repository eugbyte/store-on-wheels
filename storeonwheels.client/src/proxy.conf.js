const { env } = require('process');

function getBackendUrl() {
  let target = "https://localhost:7121";
  if (env.ASPNETCORE_HTTPS_PORT) {
    target = `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`;
  }
  else if (env.ASPNETCORE_URLS) {
    target = env.ASPNETCORE_URLS.split(";")[0];
  }
  console.log({ target });
  return target;
}

const PROXY_CONFIG = [
  {
    context: [
      "^/api",
    ],
    target: getBackendUrl(),
    secure: false,  // ignore lack of SSL cert
    changeOrigin: true, // prevents CORs
    "logLevel": "debug",
  }
]

module.exports = PROXY_CONFIG;
