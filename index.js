require('dotenv').config();
const TwitchClient = require('twitch').default;
const WebHookListener = require('twitch-webhooks').default;

const eventsListener = require('./events-listener');
const files = require('./files');
const streamStatus = require('./stream-status');

const twitchClient = TwitchClient.withClientCredentials(
  process.env.TWITCH_CLIENT_ID,
  process.env.TWITCH_CLIENT_SECRET
);

let streamStatusSubscription;
WebHookListener.create(twitchClient, { port: 8090 })
  .then(listener => {
    listener.listen();
    listener
      .subscribeToStreamChanges(process.env.TWITCH_USER_ID, handleStreamChanges)
      .then(subscription => {
        streamStatusSubscription = subscription;
      })
      .catch(error => console.error(error));
  })
  .catch(error => console.error(error));

eventsListener.start();

eventsListener._testEvent('follow');

// console.dir(eventsListener.getSessionData());

function handleStreamChanges(stream) {
  if (!stream) {
    console.log('Stream is offline');
    streamStatusSubscription.stop();
  }
}
