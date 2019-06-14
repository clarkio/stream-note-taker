const eventsListener = require('./events-listener');
const files = require('./files');
const stream = require('./stream');
const sessionData = require('./data');

const logger = require('./logger');

eventsListener.start();

const monitorInterval = stream.startMonitoring();
const checkStatusInterval = setInterval(() => {
  if (!stream.isStreamOnline()) {
    logger.log('Stream is offline');
    files.writeStreamNotes(sessionData.getAllData());

    clearInterval(monitorInterval);
    clearInterval(checkStatusInterval);
    process.exit();
  }
}, 10000);

// Uncomment the following to manually test events while offline
/*
eventsListener._testEvent('follow');
eventsListener._testEvent('follow');
eventsListener._testEvent('subscriber');
eventsListener._testEvent('giftedsub');
eventsListener._testEvent('cheer');
eventsListener._testEvent('raid');
*/
