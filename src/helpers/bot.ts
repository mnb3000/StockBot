import Telegraf, { SceneContextMessageUpdate } from 'telegraf';
import { User } from 'telegram-typings';

const { BOT_TOKEN, BOT_USERNAME, ADMIN_ID } = process.env;
if (!BOT_TOKEN) {
  console.error('No bot token specified!');
  process.exit(1);
}

if (!BOT_USERNAME) {
  console.error('No bot username specified!');
  process.exit(1);
}

if (!ADMIN_ID) {
  console.error('No admin id specified!');
  process.exit(1);
}

// @ts-ignore
export const bot: Telegraf<SceneContextMessageUpdate> = new Telegraf(BOT_TOKEN, {
  username: BOT_USERNAME,
});

bot.telegram.getMe().then((botInfo: User) => {
  console.log(`Logged in as @${botInfo.username}`);
});
