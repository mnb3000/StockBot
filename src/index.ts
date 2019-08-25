import 'reflect-metadata';
import { session } from 'telegraf';
import { bot, bootstrapDatabase } from './helpers';
import { attachUser } from './middlewares/attachUser';
import { logger } from './helpers/logger';
import { loginShutterstock, downloadShutterstockImage } from './grabbers/shuttestock';


async function main() {
  // DB Setup
  await bootstrapDatabase();

  // Stock login
  await loginShutterstock();

  // Middlewares
  bot.use(attachUser);
  bot.use(session());

  // Error Handling
  bot.catch((err: Error) => {
    logger.logError(err);
  });

  await bot.launch();
  await Promise.all([
    downloadShutterstockImage('https://www.shutterstock.com/image-photo/one-girl-splashing-gardening-house-on-685423807'),
    downloadShutterstockImage('https://www.shutterstock.com/image-vector/hand-drawn-beautiful-cute-summer-girl-1068852989'),
  ]);
  console.log('Bot started!');
}

main()
  .catch(e => console.error(e));
