require('dotenv').config();
const io = require('socket.io-client');

const testEventData = require('./test/event-mock-data.json');

const accessToken = process.env.SE_TOKEN;
let socket;

module.exports = {
  connect,
  disconnect,
  _testEvent,
};

function connect(eventsListener) {
  socket = io('https://realtime.streamelements.com', {
    transports: ['websocket'],
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

function _onConnect() {
  console.log('Successfully connected to the websocket');

  socket.emit('authenticate', { method: 'jwt', token: accessToken });
}

function _onDisconnect() {
  console.log('Disconnected from websocket');
  // Reconnect
}

function _onAuthenticated(data) {
  const { channelId } = data;

  console.log(`Successfully connected to channel ${channelId}`);
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
