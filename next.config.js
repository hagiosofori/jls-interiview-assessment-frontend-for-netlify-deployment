const { isTargetLikeServerless } = require("next/dist/next-server/server/config");

module.exports = {
  env: {
    API_ENDPOINT: 'http://54.144.252.203',
  },
  target: "serverless",
};