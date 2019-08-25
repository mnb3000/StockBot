import Telegraf, { SceneContextMessageUpdate } from 'telegraf';
import dateFormat from 'dateformat';
import humanizeDuration from 'humanize-duration';
import { checkIfErrorDismissable } from './errorDismiss';
import { bot } from './bot';

class Logger {
  constructor() {
    this.bot = bot;
    setInterval(this.logInfo.bind(this), 60000);
  }

  bot: Telegraf<SceneContextMessageUpdate>;

  startDate = new Date();

  private errors = 0;

  private commands = 0;

  private downloads = 0;

  private async logToChannel(text: string) {
    try {
      const telegram = this.bot
        ? this.bot.telegram
        // @ts-ignore
        : new Telegraf(process.env.TOKEN, {
          username: process.env.BOT_USERNAME,
        }).telegram;
      await telegram.sendMessage(
        process.env.ADMIN_ID,
        `<b>@${process.env.BOT_USERNAME}:</b>\n${text}`,
        {
          parse_mode: 'HTML',
        },
      );
    } catch (e) {
      console.error(`Unable to log message to channel:\n${text}`);
    }
    console.log(text.replace(/<[a-z0-9/ =".:?]+>/g, '').replace(/\n/g, ' '));
  }

  private async logInfo() {
    const currDate = new Date();
    const formattedDate = dateFormat(currDate, 'dd-mm-yyyy HH:MM:ss');
    const duration = currDate.valueOf() - this.startDate.valueOf();
    await this.logToChannel(`<code>[${formattedDate}]</code>\n<b>Status:\n${humanizeDuration(duration, { round: true })}</b> uptime, <b>${this.commands}</b> commands served, <b>${this.downloads}</b> files downloaded, <b>${this.errors}</b> errors`);
  }

  async logError(err: Error) {
    if (checkIfErrorDismissable(err)) {
      return;
    }
    this.errors += 1;
    this.logToChannel(`Message: ${err.message}\n<code>${JSON.stringify(err, undefined, 2)}</code>`);
  }

  incrementCommand() {
    this.commands += 1;
  }

  incrementDownloads() {
    this.downloads += 1;
  }
}

export const logger = new Logger();
