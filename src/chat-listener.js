/* eslint-disable no-unused-vars */
require('dotenv').config();
const tmi = require('tmi.js');

const stream = require('./stream');
const data = require('./data');
const logger = require('./logger');
const files = require('./files');

const channels = process.env.TWITCH_CHANNEL.split(',');
const ttvUsername = process.env.TWITCH_USERNAME;
const ttvClientToken = process.env.TWITCH_CLIENT_TOKEN;
let client;
let moderators = [];
const markCommandPrefix = '!mark';
const noteCommandPrefix = '!note';

module.exports = {
  start
};

function start() {
  const options = {
    channels,
    connection: {
      reconnect: true,
      secure: true
    },
    identity: {
      password: ttvClientToken,
      username: ttvUsername
    },
    options: {
      debug: true
    }
  };

  client = new tmi.Client(options);

  client
    .connect()
    .then(getModerators)
    .then(chatListenerStart)
    .catch(handleTwitchChatConnectionFailure);
}

function chatListenerStart(_args) {
  logger.log('Connected successfully to Twitch Chat');

  client.on('chat', ttvChat);
  client.on('join', ttvJoin);
}

function handleTwitchChatConnectionFailure(error) {
  logger.error(error);
}

function ttvChat(_channel, user, message) {
  if (message.startsWith(markCommandPrefix)) {
    const comment = message.substr(markCommandPrefix.length).trim();
    const timestamp = stream.getStreamUptime();
    const userName = user['display-name'] || user.username || '';
    const timeStampData = data.addTimestamp(
      timestamp,
      comment,
      userName,
      'mark',
      stream.streamId
    );
    files.writeData('mark', timeStampData);
  }

  if (message.startsWith(noteCommandPrefix)) {
    const comment = message.substr(noteCommandPrefix.length).trim();
    const timestamp = stream.getStreamUptime();
    const userName = user['display-name'] || user.username || '';

    const timeStampData = data.addTimestamp(
      timestamp,
      comment,
      userName,
      'note',
      stream.streamId
    );
    if (timeStampData) {
      files.writeData('mark', timeStampData);
    }

    const noteData = data.addNote(comment, userName);
    if (noteData) {
      files.writeData('note', noteData);
    }
  }
}

function ttvJoin(_channel, username, _self) {
  if (moderators.length > 0 && moderators.includes(username)) {
    const moderatorData = data.addModerator(username);
    files.writeData('mod', moderatorData);
  }
}

function getModerators() {
  // Defaults to first channel from environment variable TWITCH_CHANNEL
  return client
    .mods(channels[0])
    .then((modsFromTwitch) => {
      moderators = modsFromTwitch;
    })
    .catch((error) => {
      logger.error('There was an issue getting moderators for the channel');
      logger.dir(error);
    });
}
