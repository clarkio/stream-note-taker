require('dotenv').config();
const tmi = require('tmi.js');

const stream = require('./stream');
const data = require('./data');
const logger = require('./logger');
const files = require('./files');

const channels = process.env.TWITCH_CHANNEL.split(',');
const ttvClientId = process.env.TWITCH_CLIENT_ID;
const ttvClientToken = process.env.TWITCH_CLIENT_TOKEN;
let client;
let moderators;
const commandPrefix = '!mark';

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
      username: this.clientUsername
    },
    options: {
      clientId: ttvClientId,
      debug: true
    }
  };

  client = new tmi.Client(options);

  client
    .connect()
    .then(chatListenerStart)
    .catch(handleTwitchChatConnectionFailure);

  client.on('chat', ttvChat);
  client.on('join', ttvJoin);
}

function chatListenerStart(args) {
  logger.log('Connected successfully to Twitch Chat');
}

function handleTwitchChatConnectionFailure(error) {
  logger.error(error);
}

function ttvChat(channel, user, message) {
  if (message.startsWith(commandPrefix)) {
    const comment = message.substr(commandPrefix.length).trim();
    const timestamp = stream.getStreamUptime();
    const userName = user['display-name'] || user.username || '';
    const timeStampData = data.addTimestamp(
      timestamp,
      comment,
      userName,
      stream.streamId
    );
    files.writeData('mark', timeStampData);
  }
}

function ttvJoin(channel, username, self) {
  if (self) {
    getModerators();
  } else {
    if (moderators.includes(username)) {
      const moderatorData = data.addModerator(username);
      files.writeData('mod', moderatorData);
    }
  }
}

function getModerators() {
  client
    .mods(channels[0])
    .then(modsFromTwitch => {
      moderators = modsFromTwitch;
    })
    .catch(error => {
      logger.error('There was an issue getting moderators for the channel');
      logger.error(error);
    });
}
