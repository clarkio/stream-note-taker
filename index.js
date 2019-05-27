const eventsListener = require('./events-listener');
const files = require('./files');
const streamStatus = require('./stream-status');

files.initTodaysStreamNotes();

eventsListener.start();

eventsListener._testEvent('follow');

// console.dir(eventsListener.getSessionData());
