/* eslint-disable prettier/prettier */
module.exports = {
  addFollower,
  addSubscriber,
  addGiftedSubscriber,
  addCheerer,
  addRaider,
  getAllData
};

let followersText = '';
let subscribersText = '';
let cheerersText = '';
let raidersText = '';

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

function getAllData() {
  return {
    followers: followersText,
    subscribers: subscribersText,
    cheerers: cheerersText,
    raiders: raidersText
  };
}
