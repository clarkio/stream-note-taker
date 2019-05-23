require('dotenv').config();
let io = require('socket.io-client');

let files = require('./files');
let accessToken = process.env.SE_TOKEN;
let socket;

module.exports = {
  start
};

function start() {
  socket = io('https://realtime.streamelements.com', {
    transports: ['websocket']
  });

  // Socket connected
  socket.on('connect', onConnect);

  // Socket got disconnected
  socket.on('disconnect', onDisconnect);

  // Socket is authenticated
  socket.on('authenticated', onAuthenticated);

  // New event received
  socket.on('event', onEvent);
}

function onConnect() {
  console.log('Successfully connected to the websocket');

  socket.emit('authenticate', { method: 'jwt', token: accessToken });
}

function onDisconnect() {
  console.log('Disconnected from websocket');
  // Reconnect
}

function onAuthenticated(data) {
  const { channelId } = data;

  console.log(`Successfully connected to channel ${channelId}`);

  // Use the following to manually trigger events for testing
  // onEvent({ type: 'follow', data: { username: 'test' } });
}

function onEvent(event) {
  // Deal with events
  console.log('An event was triggered');
  console.dir(event);

  // Event types to check for can be found here: https://developers.streamelements.com/endpoints/activities
  if (event.type === 'follow') {
    files.addFollower(event.data.username);
  }
}
