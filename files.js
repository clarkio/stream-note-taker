require('dotenv').config();
let moment = require('moment');
let fs = require('fs');

// TODO: change this back to use the env variable
let uri = './'; //process.env.WORKING_DIRECTORY;
let todayDate = moment().format('YYYY-MM-DD');
let fileName = `${todayDate}.md`;
let fullUri = `${uri}${fileName}`;

module.exports = {
  initTodaysStreamNotes,
  addFollower
};

function initTodaysStreamNotes() {
  // 1. read the markdown from the template
  // 2. write that markdown to a new file for today's stream
}

function addFollower(username) {
  console.log(todayDate);

  let followerEntry = `- [@${username}](https://twitch.tv/${username})`;

  // return fs.writeFileSync(fullUri, followerEntry);
}
