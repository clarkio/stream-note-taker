const fs = require('fs');
require('dotenv').config();
const moment = require('moment');
const _template = require('lodash.template');
const markdownIt = require('markdown-it');

const logger = require('./logger');

const md = markdownIt();

// TODO: change this back to use the env variable
const uri = './'; // process.env.WORKING_DIRECTORY;
const today = moment();
const todayDate = moment().format('YYYY-MM-DD');
const finaleFileName = `${todayDate}.md`;
const fullUri = `${uri}${finaleFileName}`;
const templateFileName = 'template.md';
const fullTemplateUri = `${uri}${templateFileName}`;

const streamSupportersHeader = `## Today's Stream Supporters\n\n`;
const followersHeader = '### Followers\n\n';
const subscribersHeader = '### Subscribers\n\n';
const cheerersHeader = '### Cheerers\n\n';
const raidersHeader = '### Raiders/Hosts\n\n';
const segmentsHeader = '## Segments\n\n';

module.exports = {
  initTodaysStreamNotes,
  writeStreamNotes,
};

function writeStreamNotes(data) {
  logger.log('Writing streams notes for this session...');
  logger.dir(data);
  let fileContents = segmentsHeader;
  fileContents += data.timestamps;
  fileContents += `\n${streamSupportersHeader}`;
  fileContents += raidersHeader;
  fileContents += data.raiders;
  fileContents += `\n${subscribersHeader}`;
  fileContents += data.subscribers;
  fileContents += `\n${cheerersHeader}`;
  fileContents += data.cheerers;
  fileContents += `\n${followersHeader}`;
  fileContents += data.followers;
  fs.writeFileSync(fullUri, fileContents);
}

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
          logger.log(header);
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
  logger.dir(temp[0].children);
  logger.log(todaysStreamNotesContent);
}
