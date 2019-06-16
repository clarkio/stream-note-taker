/* eslint-disable prettier/prettier */
require('dotenv').config();

module.exports = {
  addFollower,
  addSubscriber,
  addGiftedSubscriber,
  addCheerer,
  addRaider,
  addTimestamp,
  getAllData
};

const channel = process.env.TWITCH_CHANNEL.toLowerCase();
let followersText = '';
let subscribersText = '';
let cheerersText = '';
let raidersText = '';
let timestampsText = '| Timestamp | Topic |\n| --------- | ------------ |\n';

function addFollower(username) {
  if (!username) {
    return;
  }

  followersText += `- [@${username}](https://twitch.tv/${username})\n`;
}

function addSubscriber(username, months) {
  if (!username || !months) {
    return;
  }

  const monthsText = months > 1 ? 'months' : 'month';
  subscribersText += `- [@${username}](https://twitch.tv/${username}) (${months} ${monthsText})\n`;
}

function addGiftedSubscriber(username, months, gifterUsername) {
  if (!username || !months || !gifterUsername) {
    return;
  }

  const monthsText = months > 1 ? 'months' : 'month';
  subscribersText += `- [@${username}](https://twitch.tv/${username}) (${months} ${monthsText}) \`gifted by\` [@${gifterUsername}](https://twitch.tv/${gifterUsername})\n`;
}

function addCheerer(username, bits) {
  if (!username || !bits) {
    return;
  }

  cheerersText += `- [@${username}](https://twitch.tv/${username}): ${bits} bits\n`;
}

function addRaider(username, raidCount, hostCount) {
  if (!username || !raidCount) {
    return;
  }

  raidersText += `- [@${username}](https://twitch.tv/${username}) (${raidCount})\n`;
}

function addTimestamp(timestamp, comment, username) {
  if (!timestamp) {
    return;
  }

  if (username && username.toLowerCase() !== channel) {
    timestampsText += `| ${timestamp} | ${comment} created by [@${username}](https://twitch.tv/${username}) |\n`;
  } else {
    timestampsText += `| ${timestamp} | ${comment} |\n`;
  }
}

function getAllData() {
  return {
    followers: followersText,
    subscribers: subscribersText,
    cheerers: cheerersText,
    raiders: raidersText,
    timestamps: timestampsText
  };
}
