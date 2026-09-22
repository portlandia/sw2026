// Mocha root hooks: boot the real Express server so Supertest calls it over
// HTTP (not in-process via require), and share BASE_URL with every test file.
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}/api`;
const SERVER_ENTRY = path.join(__dirname, '..', '..', 'src', 'server.js');

let serverProcess;

function waitForServer(retriesLeft = 30) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      http
        .get(`${BASE_URL}/healthcheck`, (res) => {
          res.resume();
          resolve();
        })
        .on('error', () => {
          if (retriesLeft <= 0) {
            reject(new Error('Server did not start in time'));
            return;
          }
          setTimeout(() => waitForServer(retriesLeft - 1).then(resolve, reject), 200);
        });
    };
    attempt();
  });
}

exports.mochaHooks = {
  async beforeAll() {
    this.timeout(15000);
    serverProcess = spawn('node', [SERVER_ENTRY], {
      env: { ...process.env, PORT },
      stdio: 'ignore',
    });
    await waitForServer();
  },
  afterAll() {
    if (serverProcess) {
      serverProcess.kill();
    }
  },
};

exports.BASE_URL = BASE_URL;
