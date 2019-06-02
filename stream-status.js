require('dotenv').config();
const axios = require('axios');

const logger = require('./logger');

const username = process.env.TWITCH_CHANNEL;
let isOnline = false;

module.exports = {
  startMonitoring,
  isStreamOnline,
  getStreamStatus,
};

function startMonitoring() {
  return setInterval(getStreamStatus, 30000);
}

function isStreamOnline() {
  return isOnline;
}

function getStreamStatus() {
  return axios
    .get(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID },
    })
    .then(response => {
      isOnline = !!response.data && response.data.length > 0;
    })
    .catch(error => {
      logger.error(error);
      isOnline = false;
    });
}
