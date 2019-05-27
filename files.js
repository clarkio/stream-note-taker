const fs = require('fs');
require('dotenv').config();
const moment = require('moment');
const _template = require('lodash.template');
const markdownIt = require('markdown-it');

const md = markdownIt();

// TODO: change this back to use the env variable
const uri = './'; // process.env.WORKING_DIRECTORY;
const today = moment();
const todayDate = moment().format('YYYY-MM-DD');
const finaleFileName = `${todayDate}.md`;
const fullUri = `${uri}${finaleFileName}`;
const templateFileName = 'template.md';
const fullTemplateUri = `${uri}${templateFileName}`;

module.exports = {
  initTodaysStreamNotes,
  addFollower,
};

function initTodaysStreamNotes() {
  let todaysStreamNotesContent = '';
  // 1. read the markdown from the template
  // 2. write that markdown to a new file for today's stream
  const templateContents = fs.readFileSync(fullTemplateUri, {
    encoding: 'utf8',
  });
  const temp = md.parseInline(templateContents, {});
  temp[0].children.forEach(token => {
    switch (token.type) {
      case 'text': {
        if (token.content.includes('Stream Notes')) {
          const compiled = _template(token.content);
          const header = compiled({
            DayName: today.format('dddd'),
            Month: today.format('MMMM'),
            Day: today.format('DD'),
            Year: today.format('YYYY'),
          });
          console.log(header);
          todaysStreamNotesContent += header;
        } else {
          todaysStreamNotesContent += token.content;
        }
        break;
      }

      case 'softbreak': {
        todaysStreamNotesContent += '\n';
        break;
      }

      default:
        break;
    }
  });
  console.dir(temp[0].children);
  console.log(todaysStreamNotesContent);
}

function addFollower(username) {
  console.log(todayDate);

  const followerEntry = `- [@${username}](https://twitch.tv/${username})`;

  // return fs.writeFileSync(fullUri, followerEntry);
}
