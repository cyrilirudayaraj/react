const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || 'localhost';
const PROXY_HOST = process.env.INTRANET_PROXY_HOST;
const PROXY_PORT = process.env.INTRANET_PROXY_PORT || 443;

const APPLICATION_HOMEPAGE = '/index.esp';
const API_PROXY_PATH = '/collector/rules2/workflow/api/*';
const INITIAL_REDIRECT_URL =
  '/commonlogin.esp?REDIRECT_URL=' + APPLICATION_HOMEPAGE;
const INDEX = '/index.html';

module.exports = function (app) {
  if (PROXY_HOST && PROXY_PORT) {
    const currentDirectory = path.resolve(__dirname);
    const certificatePath = path.join(
      currentDirectory,
      '../certificates/athena-ca-chain.pem'
    );

    const athenaBaseProxy = {
      changeOrigin: true,
      cookieDomainRewrite: process.env.HOST,
      secure: true,
      target: {
        ca: fs.readFileSync(certificatePath),
        host: PROXY_HOST,
        hostname: PROXY_HOST,
        port: PROXY_PORT,
        protocol: 'https:',
      },
    };

    const localTarget = `https://${HOST}:${PORT}`;

    app.use(
      '^[/]?$',
      createProxyMiddleware(
        Object.assign({}, athenaBaseProxy, {
          pathRewrite: {
            '.*': INITIAL_REDIRECT_URL,
          },
        })
      )
    );

    app.use(
      APPLICATION_HOMEPAGE,
      createProxyMiddleware({
        secure: false,
        pathRewrite: {
          '.*': INDEX,
        },
        target: localTarget,
      })
    );

    app.use(
      API_PROXY_PATH,
      createProxyMiddleware(Object.assign({}, athenaBaseProxy))
    );
  }
};
