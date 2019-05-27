require('dotenv').config();
const axios = require('axios');

const username = process.env.TWITCH_CHANNEL;
let isStreamOnline = false;
let monitorInterval;

module.exports = {
  isStreamOnline,
  startMonitoring,
  stopMonitoring,
};

function startMonitoring() {
  monitorInterval = setInterval(getStreamStatus, 30000);
}

function stopMonitoring() {
  clearInterval(monitorInterval);
}

function getStreamStatus() {
  axios
    .get(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID },
    })
    .then(response => {
      console.log('response received');
      isStreamOnline = response.data && response.data.length > 0;
    })
    .catch(error => {
      console.error(error);
      isStreamOnline = false;
    });
}
