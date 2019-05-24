let eventsListener = require('./events-listener');
let files = require('./files');

files.initTodaysStreamNotes();

eventsListener.start();
