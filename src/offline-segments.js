/** ************************************* */

// Run the following and change end time as well as the video id as needed
// npx twitch-chatlog --end=04:04:38 -r -p 441227491 | grep '!mark' > chat.json
// Then run this script to generate the timestamp marker table for stream notes markdown

/** ************************************* */
const fs = require('fs');
const moment = require('moment');

// update the filename here if you export to a different file using the twitch-chatlog tool
const data = require('../chat.json');

const chatCommand = '!mark';

function getStringMeasurement(duration) {
  return duration < 10 ? `0${duration}` : duration.toString();
}

function getCreatedBy(username) {
  return username.toLowerCase() === 'clarkio'
    ? ''
    : `(created by [@${username}](https://twitch.tv/${username}))`;
}

data.forEach(item => {
  if (item.message.body.includes(chatCommand)) {
    const timestamp = moment('2019-01-01')
      .startOf('day')
      .seconds(item.content_offset_seconds);
    const timestampString = timestamp.format('HH:mm:ss');
    const hour = getStringMeasurement(timestamp.hours());
    const minute = getStringMeasurement(timestamp.minutes());
    const second = getStringMeasurement(timestamp.seconds());
    const username = item.commenter.display_name;
    const message = item.message.body.substr(chatCommand.length).trim();

    const segment = `| [${timestampString}](?t=${hour}h${minute}m${second}s) | **${message} ${getCreatedBy(
      username
    )}** |\n`;
    console.log(segment);

    fs.appendFileSync(
      `./segments-${moment().format('YYYY-MM-DD')}.md`,
      segment
    );
  }
});
