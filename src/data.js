/* eslint-disable prettier/prettier */
require('dotenv').config();

module.exports = {
  addFollower,
  addSubscriber,
  addGiftedSubscriber,
  addCheerer,
  addRaider,
  addTimestamp,
  addModerator,
  addNote,
  getAllData,
};

let followersText = '';
let subscribersText = '';
let cheerersText = '';
let raidersText = '';
let timestampsText = '| Timestamp | Topic |\n| --------- | ------------ |\n';
let moderatorsText = '';
let notesText = '';

function addFollower(username) {
  if (!username) {
    return 'ERROR: Missing Username';
  }

  const formattedText = `- [@${username}](https://twitch.tv/${username})\n`;
  followersText += formattedText;
  return formattedText;
}

function addSubscriber(username, months) {
  if (!username || !months) {
    return 'ERROR: Missing Username or Months';
  }

  const monthsText = months > 1 ? 'months' : 'month';
  const formattedText = `- [@${username}](https://twitch.tv/${username}) (${months} ${monthsText})\n`;
  subscribersText += formattedText;
  return formattedText;
}

function addGiftedSubscriber(username, months, gifterUsername) {
  if (!username || !months || !gifterUsername) {
    return 'ERROR: Missing Username, Months or Gifter Username';
  }

  const monthsText = months > 1 ? 'months' : 'month';
  const formattedText = `- [@${username}](https://twitch.tv/${username}) (${months} ${monthsText}) \`gifted by\` [@${gifterUsername}](https://twitch.tv/${gifterUsername})\n`;
  subscribersText += formattedText;
  return formattedText;
}

function addCheerer(username, bits) {
  if (!username || !bits) {
    return 'ERROR: Missing Username or Bits';
  }

  const formattedText = `- [@${username}](https://twitch.tv/${username}): ${bits} bits\n`;
  cheerersText += formattedText;
  return formattedText;
}

// eslint-disable-next-line no-unused-vars
function addRaider(username, raidCount, hostCount) {
  if (!username || !raidCount) {
    return 'ERROR: Missing Username or Raid Count';
  }
  const formattedText = `- [@${username}](https://twitch.tv/${username}) (${raidCount})\n`;
  raidersText += formattedText;
  return formattedText;
}

function addTimestamp(
  timestamp,
  comment,
  username,
  type,
  streamId = 'https://www.twitch.tv/videos/id'
) {
  if (
    !timestamp ||
    !(timestamp instanceof Object) ||
    timestamp instanceof Array
  ) {
    return ' ERROR: Missing Valid Timestamp';
  }

  if (!timestamp.hour || !timestamp.minute || !timestamp.second) {
    const message = 'The timestamp provided doesn\'t have sufficient data';
    console.warn(message);
    return message;
  }

  const channel = process.env.TWITCH_CHANNEL.toLowerCase();
  const styleText = type && type.toLowerCase() === 'mark' ? '**' : '';
  const timestampString = `${timestamp.hour}:${timestamp.minute}:${timestamp.second}`;
  const timestampLink = `${streamId}?t=${timestamp.hour}h${timestamp.minute}m${timestamp.second}s`;
  let formattedText = '';

  if (username && username.toLowerCase() !== channel) {
    formattedText = `| [${timestampString}](${timestampLink}) | ${styleText}${
      comment || ''
    } (created by [@${username}](https://twitch.tv/${username}))${styleText} |\n`;
  } else {
    formattedText = `| [${timestampString}](${timestampLink}) | ${styleText}${
      comment || ''
    }${styleText} |\n`;
  }
  timestampsText += formattedText;
  return formattedText;
}

function addNote(note, username) {
  if (!note) {
    return 'ERROR: Missing Note';
  }

  const channel = process.env.TWITCH_CHANNEL.toLowerCase();
  let formattedData;
  if (username && username.toLowerCase() !== channel) {
    formattedData = ` - ${note} (added by [@${username}](https://twitch.tv/${username}))\n`;
  } else {
    formattedData = ` - ${note}\n`;
  }

  notesText += formattedData;
  return formattedData;
}

function addModerator(username) {
  if (!username) {
    return 'ERROR: Missing Username';
  }

  const formattedText = `- [@${username}](https://twitch.tv/${username})\n`;
  moderatorsText += formattedText;
  return formattedText;
}

function getAllData() {
  return {
    followers: followersText,
    subscribers: subscribersText,
    cheerers: cheerersText,
    raiders: raidersText,
    timestamps: timestampsText,
    notes: notesText,
    moderators: moderatorsText,
  };
}
