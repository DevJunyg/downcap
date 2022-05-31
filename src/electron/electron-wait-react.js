const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 3000;
const IsDevelopment = () => process.env.ELECTRON_APP_ENVIRONMENT === "Development";

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({ port: port }, () => {
  client.end();
  if (!startedElectron) {
    startedElectron = true;
    const electronCmd = IsDevelopment() ? "yarn run electron-run:dev" : "yarn run electron-run";
    const exec = require('child_process').exec;
    const electron = exec(electronCmd);
    electron.stdout.on('data', console.log)
    electron.stderr.on('data', console.error)
  }
});

tryConnection();

client.on('error', () => setTimeout(tryConnection, 1000));
