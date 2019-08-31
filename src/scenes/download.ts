import { BaseScene } from 'telegraf';
import { Strings } from '../helpers';
import {
  downloadAudioblocksAudio,
  downloadShutterstockImage,
  downloadStoryblocksImage,
  downloadVideoblocksVideo,
} from '../grabbers';

export const downloadScene = new BaseScene('download');

downloadScene.enter(ctx => ctx.replyWithMarkdown(Strings.DOWNLOAD_ENTER));

downloadScene.on('message', async ctx => {
  if (!ctx.message || !ctx.message.text) {
    return;
  }
  if (!ctx.dbUser.isAuthorized) {
    await ctx.scene.enter('auth');
    return;
  }
  await ctx.replyWithMarkdown(Strings.DOWNLOAD_LOADING);
  const { text } = ctx.message;
  let filePath: string | undefined;
  if (text.includes('www.shutterstock.com')) {
    filePath = await downloadShutterstockImage(text);
  } else if (text.includes('www.storyblocks.com')) {
    filePath = await downloadStoryblocksImage(text);
  } else if (text.includes('www.audioblocks.com')) {
    filePath = await downloadAudioblocksAudio(text);
  } else if (text.includes('www.videoblocks.com')) {
    filePath = await downloadVideoblocksVideo(text);
  }
  if (!filePath) {
    await ctx.replyWithMarkdown(Strings.DOWNLOAD_INVALID_URL);
    return;
  }
  await ctx.replyWithDocument({ source: filePath });
});
