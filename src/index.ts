import 'reflect-metadata';
import { session } from 'telegraf';
import {
  bot, bootstrapDatabase, logger, createDownloadFolders,
} from './helpers';
import { attachUser } from './middlewares/attachUser';
import { loginShutterstock, loginStoryblocks } from './grabbers';
import { stage } from './middlewares/stage';

async function main() {
  // DB Setup
  await bootstrapDatabase();

  // Folder setup
  await createDownloadFolders();

  // Stock login
  await Promise.all([loginStoryblocks(), loginShutterstock()]);

  // Middlewares
  bot.use(attachUser);
  bot.use(session());
  bot.use(stage.middleware());

  // Start command
  bot.command('start', ctx => ctx.scene.enter('auth'));
  bot.on('message', ctx => {
    if (!ctx.scene.current) {
      ctx.scene.enter('auth');
    }
  });

  // Error Handling
  bot.catch((err: Error) => {
    logger.logError(err);
  });

  await bot.launch();
  console.log('Bot started!');
}

main()
  .catch(e => console.error(e));
