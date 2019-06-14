require('dotenv').config();
const axios = require('axios');
const moment = require('moment');

const username = process.env.TWITCH_CHANNEL;
let isOnline = false;
let streamStartDateTime;

module.exports = {
  startMonitoring,
  isStreamOnline,
  getStreamStatus,
  getStreamUptime,
};

getStreamStartTime();

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
      console.error(error);
      isOnline = false;
    });
}

function getStreamStartTime() {
  return axios
    .get(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID },
    })
    .then(response => {
      if (!!response.data && response.data.length > 0) {
        streamStartDateTime = response.data[0].started_at;
      }
    })
    .catch(error => {
      console.error('Failed to retrieve stream start time', error);
    });
}

function getStreamUptime() {
  if (!streamStartDateTime) {
    console.log(
      'Stream Start Date/Time has not been recorded and therefore we cannot calculate uptime'
    );
    return;
  }

  return moment
    .utc(moment.utc() - moment.utc(streamStartDateTime))
    .format('HH:mm:ss');
}
