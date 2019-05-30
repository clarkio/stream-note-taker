require('dotenv').config();

const streamElementsSocket = require('./streamelements-socket');
const files = require('./files');
const sessionData = require('./data');

module.exports = {
  start,
  getSessionData,
  onEvent,
  onEventTest,
  _testEvent,
};

function start() {
  // We pass in 'this' context so when events are received they will be passed to this module for handling
  streamElementsSocket.connect(this);
}

function getSessionData() {
  return sessionData.getAllData();
}

// https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-event
function onEvent(event) {
  // Event types to check for can be found here: https://developers.streamelements.com/endpoints/activities
  switch (event.type) {
    case 'follow':
      sessionData.addFollower(event.data.username);
      break;
    case 'subscriber': {
      determineSubscriberEventType(event);
      break;
    }
    case 'cheer':
      sessionData.addCheerer(event.data.username, event.data.amount);
      break;
    case 'raid':
      sessionData.addRaider(
        event.data.username,
        event.data.amount,
        event.data.amount
      );
      break;
    default:
      console.info(`Unsupported event type: ${event.type}`);
      return false;
  }

  return true;
}

function determineSubscriberEventType(event) {
  if (event.data.sender) {
    sessionData.addGiftedSubscriber(
      event.data.username,
      event.data.amount,
      event.data.sender
    );
  } else {
    sessionData.addSubscriber(event.data.username, event.data.amount);
  }
}

function onEventTest(event) {
  console.dir('Received Test Event', event);
  onEvent(event);
}

function _testEvent(eventType) {
  streamElementsSocket._testEvent(eventType);
}
