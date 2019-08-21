import Telegraf, { ContextMessageUpdate } from 'telegraf';
import { User } from 'telegram-typings';
import { report } from './report';

const { BOT_TOKEN, USERNAME, ADMIN_ID } = process.env;
if (!BOT_TOKEN) {
  console.error('No bot token specified!');
  process.exit(1);
}

if (!USERNAME) {
  console.error('No bot username specified!');
  process.exit(1);
}

if (!ADMIN_ID) {
  console.error('No admin id specified!');
  process.exit(1);
}

// @ts-ignore
export const bot: Telegraf<ContextMessageUpdate> = new Telegraf(BOT_TOKEN, { username: USERNAME });

bot.telegram.getMe().then((botInfo: User) => {
  console.log(`Logged in as @${botInfo.username}`);
});

bot.catch((err: Error) => {
  report(bot, err)
    .catch();
});
