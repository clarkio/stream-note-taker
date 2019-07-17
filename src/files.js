require('dotenv').config();
const fs = require('fs');
const moment = require('moment');
const _template = require('lodash.template');
const markdownIt = require('markdown-it');

const logger = require('./logger');

const md = markdownIt();

const directory = process.env.WORKING_DIRECTORY;
const today = moment();
const todayDate = moment().format('YYYY-MM-DD');
const finaleFileName = `${todayDate}.md`;
const fullUri = `${directory}${finaleFileName}`;
const templateFileName = 'template.md';
const fullTemplateUri = `${directory}${templateFileName}`;
const tempDataFileBaseUri = `${directory}/${todayDate}-`;
const followerFileUri = `${tempDataFileBaseUri}followers.md`;
const subscriberFileUri = `${tempDataFileBaseUri}subscribers.md`;
const cheererFileUri = `${tempDataFileBaseUri}cheerers.md`;
const raiderFileUri = `${tempDataFileBaseUri}raiders.md`;
const modsFileUri = `${tempDataFileBaseUri}moderators.md`;
const segmentsFileUri = `${tempDataFileBaseUri}segments.md`;

const streamSupportersHeader = `## Today's Stream Supporters\n\n`;
const followersHeader = '### Followers\n\n';
const subscribersHeader = '### Subscribers\n\n';
const cheerersHeader = '### Cheerers\n\n';
const raidersHeader = '### Raiders/Hosts\n\n';
const modsHeader = '### Moderators\n\n';
const segmentsHeader = '## Segments\n\n';

module.exports = {
  initTodaysStreamNotes: initTodaysStreamNotesOld,
  initDataNotes,
  writeStreamNotes,
  writeData
};

function initDataNotes() {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  fs.writeFileSync(followerFileUri, followersHeader);
  fs.writeFileSync(subscriberFileUri, subscribersHeader);
  fs.writeFileSync(cheererFileUri, cheerersHeader);
  fs.writeFileSync(raiderFileUri, raidersHeader);
  fs.writeFileSync(modsFileUri, modsHeader);
  fs.writeFileSync(segmentsFileUri, segmentsHeader);
}

function writeData(dataType, data) {
  switch (dataType) {
    case 'follow':
      fs.appendFileSync(followerFileUri, data);
      break;
    case 'subscriber':
      fs.appendFileSync(subscriberFileUri, data);
      break;
    case 'cheer':
      fs.appendFileSync(cheererFileUri, data);
      break;
    case 'raid':
      fs.appendFileSync(raiderFileUri, data);
      break;
    case 'mark':
      fs.appendFileSync(segmentsFileUri, data);
      break;
    case 'mod':
      fs.appendFileSync(modsFileUri, data);
      break;
    default:
      logger.info(`Unsupported event type: ${event.type}`);
      return false;
  }
}

function writeStreamNotes(data) {
  logger.log('Writing streams notes for this session...');

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

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  fs.writeFileSync(fullUri, fileContents);
}

function initTodaysStreamNotesOld() {
  let todaysStreamNotesContent = '';
  // 1. read the markdown from the template
  // 2. write that markdown to a new file for today's stream
  const templateContents = fs.readFileSync(fullTemplateUri, {
    encoding: 'utf8'
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
            Year: today.format('YYYY')
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
