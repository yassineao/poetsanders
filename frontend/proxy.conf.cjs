const { resolve } = require('node:path');
const { config } = require('dotenv');

const { parsed = {} } = config({ path: resolve(__dirname, '.env'), quiet: true });

const proxyTarget = process.env.API_PROXY_TARGET?.trim()
  || parsed.API_PROXY_TARGET?.trim()
  || 'http://localhost:8080';

module.exports = {
  '/auth': {
    target: proxyTarget,
    secure: false,
    changeOrigin: true,
  },
  '/wash_calendar': {
    target: proxyTarget,
    secure: false,
    changeOrigin: true,
  },
};
