/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const io = require('socket.io-client');
const axios = require('axios');

const testEventData = require('../test/event-mock-data.json');
const logger = require('./logger');

const accessToken = process.env.SE_TOKEN;
const accountId = process.env.SE_ACCOUNT_ID;
let socket;
let eventsListener;

module.exports = {
  connect,
  disconnect,
  _testEvent,
  getRecentActivities,
  setEventsListener
};

function connect(listener) {
  eventsListener = listener;
  socket = io('https://realtime.streamelements.com', {
    transports: ['websocket']
  });

  socket.on('connect', _onConnect);

  // Socket got disconnected
  socket.on('disconnect', _onDisconnect);

  // Socket is authenticated
  socket.on('authenticated', _onAuthenticated);

  // New event received
  socket.on('event', eventsListener.onEvent);

  // Emulated events from either replay in the Streamelements dashboard or through the overlay editor
  socket.on('event:test', eventsListener.onEventTest);

  // Session Reset (either manually or when the stream ends?)
  socket.on('session:reset', eventsListener.onSessionReset);
}

function disconnect() {}

async function getRecentActivities() {
  // 1. Make a request to streamelements to determine most recent session date
  // 2. Using that date capture activities that occurred since then
  // 3. Add activities to data
  try {
    let {
      data: { lastReset }
    } = await axios.get(
      `https://api.streamelements.com/kappa/v2/sessions/${accountId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    lastReset = lastReset.replace(/T.*Z/, 'T00:00:00.000Z');

    const { data: recentData } = await axios.get(
      `https://api.streamelements.com/kappa/v2/activities/${accountId}?after=${lastReset}&types=follow&types=subscriber&types=cheer&types=host&types=raid&minsub=0&mincheer=0&minhost=0&limit=300`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    recentData.forEach((activity) => {
      eventsListener.onEvent(activity);
    });

    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
}

function _onConnect() {
  logger.log('Successfully connected to the websocket');

  socket.emit('authenticate', { method: 'jwt', token: accessToken });
}

function _onDisconnect() {
  logger.log('Disconnected from websocket');
  // Reconnect
}

function _onAuthenticated(data) {
  const { channelId } = data;

  logger.log(`Successfully connected to channel ${channelId}`);
  // Use the following to manually trigger events for testing
  // onEvent({ type: 'follow', data: { username: 'test' } });
}

function _testEvent(eventType) {
  switch (eventType) {
    case 'follow':
      socket.emit('event:test', testEventData.follow);
      break;
    case 'subscriber':
      socket.emit('event:test', testEventData.subscriber);
      break;
    case 'giftedsub':
      socket.emit('event:test', testEventData.giftedSubscriber);
      break;
    case 'cheer':
      socket.emit('event:test', testEventData.cheer);
      break;
    case 'raid':
      socket.emit('event:test', testEventData.raid);
      break;
    default:
      break;
  }
}

function setEventsListener(listener) {
  eventsListener = listener;
}
