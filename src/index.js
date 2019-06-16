require('dotenv').config();

const eventsListener = require('./events-listener');
const files = require('./files');
const stream = require('./stream');
const sessionData = require('./data');
const chatListener = require('./chat-listener');
const streamElements = require('./streamelements');
const logger = require('./logger');

const captureMarkers = process.env.CAPTURE_MARKERS;
const runWhileStreaming =
  captureMarkers && captureMarkers.toLowerCase() === 'true';

// Set CAPTURE_MARKERS to true if you want to enable !mark commands for writing the timestamps in the Segments section of your stream notes while also capturing alerts to write to their corresponding sections.
// Set CAPTURE_MARKERS to false if you are running this after your most recent stream and want to capture just the alerts that happened during that session
if (runWhileStreaming) {
  eventsListener.start();
  chatListener.start();

  const monitorInterval = stream.startMonitoring();

  // Wait 10 seconds after start up to see if the stream is online
  // Continue to check until offline using the interval
  const checkStatusInterval = setInterval(() => {
    if (!stream.isStreamOnline()) {
      logger.log('Stream is now offline');
      const dataToWrite = sessionData.getAllData();
      if (dataToWrite && dataToWrite.followers !== '') {
        files.writeStreamNotes(sessionData.getAllData());
      }

      // Stop monitoring the stream for events and checking the status of the stream before exiting this app
      clearInterval(monitorInterval);
      clearInterval(checkStatusInterval);
      process.exit();
    }
  }, 10000);
} else {
  streamElements.setEventsListener(eventsListener);
  streamElements.getRecentActivities().then(completed => {
    if (completed) {
      files.writeStreamNotes(sessionData.getAllData());
    } else {
      logger.log('The recent activity retrieval did not finish');
    }
    process.exit();
  });
}

process.on('exit', () => {
  logger.log('Exiting the app');
  process.exit();
});

process.on('SIGINT', () => {
  logger.log('Terminating the app');
  // files.writeStreamNotes(sessionData.getAllData());
  process.exit();
});
