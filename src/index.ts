import 'reflect-metadata';
import { session } from 'telegraf';
import { bot, bootstrapDatabase } from './helpers';
import { attachUser } from './middlewares/attachUser';
import { logger } from './helpers/logger';
import { loginShutterstock } from './grabbers/shuttestock/login';

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
  console.log('Bot started!');
}

main()
  .catch(e => console.error(e));
