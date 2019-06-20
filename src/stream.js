require('dotenv').config();
const axios = require('axios');
const moment = require('moment');

const logger = require('./logger');

const username = process.env.TWITCH_CHANNEL;
let isStreamOnline = false;
let streamId = '';
let streamStartDateTime;

module.exports = {
  startMonitoring,
  isOnline,
  getStreamStatus,
  getStreamUptime,
  streamId,
};

getStreamStartTime();

function startMonitoring(milliseconds, _getStreamStatus = getStreamStatus) {
  return getStatusEvery(milliseconds, _getStreamStatus);
}

function getStatusEvery(milliseconds, _getStreamStatus = getStreamStatus) {
  _getStreamStatus();
  return setInterval(_getStreamStatus, milliseconds);
}

function isOnline() {
  return isStreamOnline;
}

function getStreamStatus() {
  return axios
    .get(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID },
    })
    .then(({ data: response }) => {
      // Destructuring the response wrapped by axios since Twitch API returns response as object with key 'data' as well
      isStreamOnline = response.data.length > 0;
      // TODO: double check that this id matches up to the recording id post stream
      streamId = response.data.id;
      return true;
    })
    .catch(error => {
      logger.error(error);
      isStreamOnline = false;
      return false;
    });
}

function getStreamStartTime() {
  return axios
    .get(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID },
    })
    .then(({ data: response }) => {
      if (response.data.length > 0) {
        streamStartDateTime = response.data[0].started_at;
      }
    })
    .catch(error => {
      logger.error('Failed to retrieve stream start time', error);
    });
}

function getStreamUptime() {
  if (!streamStartDateTime) {
    logger.log(
      'Stream Start Date/Time has not been recorded and therefore we cannot calculate uptime'
    );
    return;
  }

  const difference = moment.utc(moment.utc() - moment.utc(streamStartDateTime));
  const hour = getStringMeasurement(difference.hours());
  const minute = getStringMeasurement(difference.minutes());
  const second = getStringMeasurement(difference.seconds());

  return {
    hour,
    minute,
    second,
  };
  // return moment
  //   .utc(moment.utc() - moment.utc(streamStartDateTime))
  //   .format('HH:mm:ss');
}

function getStringMeasurement(duration) {
  return duration < 10 ? `0${duration}` : duration.toString();
}
