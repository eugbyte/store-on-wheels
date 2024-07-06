const { env } = require("process");

function getBackendUrl() {
  let target = "https://localhost:7108";
  if (env.ASPNETCORE_HTTPS_PORT) {
    target = `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`;
  } else if (env.ASPNETCORE_URLS) {
    target = env.ASPNETCORE_URLS.split(";")[0];
  }
  console.log({
    target,
    ASPNETCORE_HTTPS_PORT: env.ASPNETCORE_HTTPS_PORT,
    ASPNETCORE_URLS: env.ASPNETCORE_URLS,
  });
  return target;
}

const PROXY_CONFIG = [
  {
    context: ["^/api", "^/stream"],
    target: getBackendUrl(),
    secure: false, // ignore lack of SSL cert
    // changeOrigin: true, // prevents CORs
    logLevel: "debug",
    ws: true,
  },
];

module.exports = PROXY_CONFIG;
