/* eslint-disable prettier/prettier */
module.exports = {
  addFollower,
  addSubscriber,
  addGiftedSubscriber,
  addCheerer,
  addRaider,
  getAllData
};

let followersText = '### Followers\n\n\n';
let subscribersText = '### Subscribers\n\n\n';
let cheerersText = '### Cheerers\n\n\n';
let raidersText = '### Raiders/Hosts\n\n\n';

function addFollower(username) {
  followersText += `- [@${username}](https://twitch.tv/${username})\n`;
}

function addSubscriber(username, months) {
  const monthsText = months > 1 ? 'months' : 'month';
  subscribersText += `- [@${username}](https://twitch.tv/${username}) (${months} ${monthsText})\n`;
}

function addGiftedSubscriber(username, months, gifterUsername) {
  const monthsText = months > 1 ? 'months' : 'month';
  subscribersText += `- [@${username}](https://twitch.tv/${username}) (${months} ${monthsText}) \`gifted by\` [@${gifterUsername}](https://twitch.tv/${gifterUsername})\n`;
}

function addCheerer(username, bits) {
  cheerersText += `- [@${username}](https://twitch.tv/${username}): ${bits} bits\n`;
}

function addRaider(username, raidCount, hostCount) {
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
