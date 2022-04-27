<div align="center">

# stream-note-taker

[![Known Vulnerabilities](https://snyk.io/test/github/clarkio/stream-note-taker/badge.svg)](https://snyk.io/test/github/clarkio/stream-note-taker)
![GitHub](https://img.shields.io/github/license/clarkio/stream-note-taker)
[![Discord](https://img.shields.io/discord/421902136457035777)](https://discord.gg/xB95beJ)
[![Twitch Status](https://img.shields.io/twitch/status/clarkio)](https://twitch.tv/clarkio)
<br>
[![Twitter Follow](https://img.shields.io/twitter/follow/_clarkio?style=social)](https://twitter.com/intent/follow?screen_name=_clarkio)

</div>

A tool that will help record stream events and notes while live streaming

- Commands to use in chat:
    - `!mark`: used to create "chapters" for events that occurred on stream. This outputs to a file called `segments.md` and in a table format. This can be used as chapters within the description of YouTube recordings for the stream

        Example format: `| 00:00:00  | Kick it off |`

    - `!note`: used to create a note of something that happened or was learned during the stream. This outputs to a file called `notes.md`.

        Example format:  `- this is a note (added by [@clarkio](https://twitch.tv/clarkio))\n`

## Clarkio
This game was built with 💙 live on stream with the programming community. Come and hang out with us over on Twitch!

> https://twitch.tv/clarkio

### Prerequisites

- Node.js: [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows)
- [Streamelements account](https://streamelements.com) (it's possible to move away from this dependency but requires some code changes)

### Update/create your .env file

In the root of the repo, you'll see an example [.env-example](.env-example) file, copy this, and create a `.env` file

Fill in the following fields in your new `.env` file:

- WORKING_DIRECTORY=/Your/path/to/output/files/
- TWITCH_CHANNEL=(your channel to monitor)
- CAPTURE_MARKERS=(set to true if running while live streaming)
- TWITCH_USERNAME=(your bot username or your username)
- TWITCH_CLIENT_ID=
- TWITCH_CLIENT_TOKEN=
- SE_ACCOUNT_ID=
- SE_TOKEN=

If you don't have values for these go to the [Setup](#Setup) section of this document

### Quick Start
- Open a terminal/command line in the project's directory on your machine
- Run `npm i`
- Run `npm start`

## Setup

### Get Twitch App Client ID and Secret

1. Go to [Twitch Dev](https://dev.twitch.tv) and sign in
1. Go to [Apps Console](https://dev.twitch.tv/console/apps) and click on "Register Your Application"
1. Enter a name of your choosing (such as "Download Twitch Markers"), a redirect of `https://localhost` and category of your choosing (such as Broadcaster Suite). Then click "Create"
1. You'll be brought back to the Apps Console. Find your new app with the name you entered and click "Manage"
1. Find the "Client ID" field and copy its value. Save it in a safe place
1. Under "Client Secret" click "New Secret" you'll be prompted with a message to confirm you want to generate a new secret. Select "OK"
1. You'll see a new block of text right above the "New Secret" button. Copy that text and save it in a safe place as well
1. Back in this project folder, find the `.env-example` file and rename it to `.env` or create a new file with the name `.env`
1. Inside this file add the values you copied in the previous step to their corresponding environment variables. For example add the "Client ID" value right after equals in `TWITCH_CLIENT_ID=`
1. Set the `TWITCH_CHANNEL` variable value to the channel you want to use and retrieve the stream markers from

### Get Streamelements Account Id and Token

1. Go to [Streamelements.com](https://streamelements.com) and sign in with your Twitch account
1. Click on your account in the top-right corner, click on your account owner link in that menu and then select "Channel settings"
1. You should see an "Account ID" field now. Copy its value and save it in your `.env` file for `SE_ACCOUNT_ID=`
1. Select "Show Secrets" toggle button to show your Streamelements token. Find the "JWT Token" field and copy and save its value in the `.env` file for `SE_TOKEN=`


