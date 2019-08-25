import 'reflect-metadata';
import { session } from 'telegraf';
import { bot, bootstrapDatabase, logger } from './helpers';
import { attachUser } from './middlewares/attachUser';
import { loginShutterstock, loginStoryblocks } from './grabbers';

async function main() {
  // DB Setup
  await bootstrapDatabase();

  // Stock login
  // await loginShutterstock();
  await loginStoryblocks();

  // Middlewares
  bot.use(attachUser);
  bot.use(session());

  // Error Handling
  bot.catch((err: Error) => {
    logger.logError(err);
  });

  await bot.launch();
  console.log('Bot started!');
}

main()
  .catch(e => console.error(e));
