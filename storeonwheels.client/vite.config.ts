import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import plugin from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import child_process from "child_process";
import { env } from "process";

const { cert: PemCert, key: PrivateKey } = generatePem();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [plugin()],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // prefixes the root url whenever the regex pattern matches
    proxy: {
      "^/api": {
        target: getBackendUrl(),
        changeOrigin: true, // prevents CORs
        secure: false, // ignore lack of SSL Cert
      },
      "/stream": {
        target: 'wss://localhost:7108',
        ws: true,
        secure: false
      },
    },
    port: 5173,
    https: {
      key: PrivateKey,
      cert: PemCert,
    },
  },
});

function getBackendUrl(): string {
  let target = "https://localhost:7121";

  if (env.ASPNETCORE_HTTPS_PORT) {
    target = `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`;
  } else if (env.ASPNETCORE_URLS) {
    target = env.ASPNETCORE_URLS.split(";")[0];
  }

  console.log({ target });
  return target;
}

interface PemPair {
  key: string;
  cert: string;
}

function generatePem(): PemPair {
  const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ""
      ? `${env.APPDATA}/ASP.NET/https`
      : `${env.HOME}/.aspnet/https`;

  const certificateName = "storeonwheels.client";
  const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
  const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

  if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (
      0 !==
      child_process.spawnSync(
        "dotnet",
        ["dev-certs", "https", "--export-path", certFilePath, "--format", "Pem", "--no-password"],
        { stdio: "inherit" },
      ).status
    ) {
      throw new Error("Could not create certificate.");
    }
  }

  return {
    key: fs.readFileSync(keyFilePath).toString(),
    cert: fs.readFileSync(certFilePath).toString(),
  };
}
