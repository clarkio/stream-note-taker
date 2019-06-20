require('dotenv').config();

const streamElementsSocket = require('./streamelements');
const sessionData = require('./data');
const files = require('./files');
const logger = require('./logger');

module.exports = {
  start,
  getSessionData,
  onEvent,
  onEventTest,
  _testEvent
};

function start() {
  // We pass in 'this' context so when events are received they will be passed to this module for handling
  streamElementsSocket.connect(this);
}

function getSessionData() {
  return sessionData.getAllData();
}

// https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-event
function onEvent(event, _sessionData = sessionData) {
  let result;
  // Event types to check for can be found here: https://developers.streamelements.com/endpoints/activities
  switch (event.type) {
    case 'follow':
      result = _sessionData.addFollower(event.data.username);
      break;
    case 'subscriber': {
      result = determineSubscriberEventType(event, _sessionData);
      break;
    }
    case 'cheer':
      result = _sessionData.addCheerer(event.data.username, event.data.amount);
      break;
    case 'raid':
      result = _sessionData.addRaider(
        event.data.username,
        event.data.amount,
        event.data.amount
      );
      break;
    default:
      logger.info(`Unsupported event type: ${event.type}`);
      return false;
  }

  files.writeData(event.type, result);

  return true;
}

function determineSubscriberEventType(event, _sessionData = sessionData) {
  let result;

  if (event.data.sender) {
    result = _sessionData.addGiftedSubscriber(
      event.data.username,
      event.data.amount,
      event.data.sender
    );
  } else {
    result = _sessionData.addSubscriber(event.data.username, event.data.amount);
  }

  return result;
}

function onEventTest(event) {
  logger.dir('Received Test Event', event);
  onEvent(event);
}

function _testEvent(eventType) {
  streamElementsSocket._testEvent(eventType);
}
