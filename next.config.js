const { isTargetLikeServerless } = require("next/dist/next-server/server/config");

module.exports = {
  env: {
    API_ENDPOINT: 'https://immense-gorge-55221.herokuapp.com',
  },
  target: "serverless",
};