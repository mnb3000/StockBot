# Stock downloader

## Setup
You need [Node.js](https://nodejs.org/) (>= 10) to run this bot.  
[Yarn](https://yarnpkg.com) is recommended, but not required

1. Create a bot via [@BotFather](https://t.me/BotFather) and grab a **token**.
2. Clone this repository.
3. Install dependencies via `yarn install`.
4. Copy `.env.sample` to `.env` and edit it.
5. Start the bot via `yarn start` (or start the bot with live reload via `yarn dev`)

You can also start the bot via pm2 (`yarn start_daemon`) It will automatically restart each time it crashes and every day at **00:00** local time
