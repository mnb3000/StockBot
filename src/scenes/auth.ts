import { BaseScene } from 'telegraf';
import { Strings } from '../helpers';

export const authScene = new BaseScene('auth');
authScene.enter(async ctx => {
  if (ctx.dbUser.isAuthorized) {
    await ctx.scene.enter('download');
    return;
  }
  await ctx.replyWithMarkdown(Strings.AUTH_ENTER);
});

authScene.on('message', async ctx => {
  if (!ctx.message) {
    return;
  }
  if (ctx.message.text === process.env.BOT_PASSWORD) {
    ctx.dbUser.isAuthorized = true;
    await ctx.dbUser.save();
    await ctx.replyWithMarkdown(Strings.AUTH_CORRECT);
    await ctx.scene.enter('download');
  } else {
    await ctx.replyWithMarkdown(Strings.AUTH_INCORRECT);
  }
});
