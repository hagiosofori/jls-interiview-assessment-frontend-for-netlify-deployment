const { isTargetLikeServerless } = require("next/dist/next-server/server/config");

module.exports = {
  env: {
    API_ENDPOINT: 'http://localhost',
  },
  target: "serverless",
};