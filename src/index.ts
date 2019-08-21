import 'reflect-metadata';
import { session } from 'telegraf';
import { bot, bootstrapDatabase } from './helpers';
import { attachUser } from './middlewares/attachUser';

async function main() {
  // DB Setup
  await bootstrapDatabase();

  // Middlewares
  bot.use(attachUser);
  bot.use(session());

  bot.startPolling();
}

main()
  .catch(e => console.error(e));
