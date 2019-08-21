import 'reflect-metadata';
import { session } from 'telegraf';
import { bot, bootstrapDatabase } from './helpers';
import { attachUser } from './middlewares/attachUser';
import { logger } from './helpers/logger';

async function main() {
  // DB Setup
  await bootstrapDatabase();

  // Middlewares
  bot.use(attachUser);
  bot.use(session());

  // Error Handling
  bot.catch((err: Error) => {
    logger.logError(err);
  });

  await bot.launch();
}

main()
  .catch(e => console.error(e));
