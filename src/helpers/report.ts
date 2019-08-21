import Telegraf, { ContextMessageUpdate } from 'telegraf';
import { checkIfErrorDismissable } from './error';

export async function report(bot: Telegraf<ContextMessageUpdate>, err: Error) {
  try {
    if (checkIfErrorDismissable(err)) {
      return;
    }
    const telegram = bot
      ? bot.telegram || bot
      // @ts-ignore
      : new Telegraf(process.env.TOKEN, {
        username: process.env.USERNAME,
      }).telegram;

    await telegram.sendMessage(
      process.env.ADMIN_ID,
      `*${process.env.USERNAME}*:\nMessage: ${
        err.message
      }\n\`\`\`${JSON.stringify(err, undefined, 2)}\`\`\``,
      {
        parse_mode: 'Markdown',
      },
    );
  } catch (e) {
    // Do nothing
  }
}
