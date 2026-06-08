const { resolve } = require('node:path');
const { config } = require('dotenv');

config({ path: resolve(__dirname, '.env'), quiet: true });

module.exports = {
  '/auth': {
    target: process.env.API_PROXY_TARGET || 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
  },
  '/wash_calendar': {
    target: process.env.API_PROXY_TARGET || 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
  },
};
