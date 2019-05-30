require('dotenv').config();
const axios = require('axios');

const username = process.env.TWITCH_CHANNEL;
let isOnline = false;
let monitorInterval;

module.exports = {
  startMonitoring,
  stopMonitoring,
  isStreamOnline,
  getStreamStatus,
};

function startMonitoring() {
  monitorInterval = setInterval(getStreamStatus, 30000);
  return true;
}

function stopMonitoring() {
  clearInterval(monitorInterval);
  return true;
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
      if (!isOnline) {
        // TODO: somehow signal this happened to write the final notes file
        stopMonitoring();
      }
    })
    .catch(error => {
      console.error(error);
      isOnline = false;
    });
}
