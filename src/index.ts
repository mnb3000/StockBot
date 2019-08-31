import 'reflect-metadata';
import { session } from 'telegraf';
import {
  bot, bootstrapDatabase, logger, createDownloadFolders,
} from './helpers';
import { attachUser } from './middlewares/attachUser';
import {
  downloadAudioblocksAudio,
  downloadShutterstockImage,
  downloadVideoblocksVideo,
  loginShutterstock,
  loginStoryblocks,
} from './grabbers';

async function main() {
  // DB Setup
  await bootstrapDatabase();

  // Folder setup
  await createDownloadFolders();

  // Stock login
  await Promise.all([loginStoryblocks()/* , loginShutterstock() */]);
  // console.log(await downloadShutterstockImage('https://www.shutterstock.com/ru/image-vector/hand-drawn-beautiful-cute-summer-girl-1068852989'));
  // console.log(await downloadAudioblocksAudio('https://www.audioblocks.com/stock-audio/creepy-low-atmosphere-ambiance.html'));
  console.log(await downloadVideoblocksVideo('https://www.videoblocks.com/video/aerial-view-of-bali-at-sunset-popular-summer-beach-in-indonesia-with-indian-ocean-and-view-on-the-bay-with-yachts-b0fe_klleliuzt1sjo'));

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
