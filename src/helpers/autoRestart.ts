import pm2 from 'pm2';
import schedule, { RecurrenceRule } from 'node-schedule';
import { logger } from './logger';

export const setupAutoRestart = async () => {
  const rule = new RecurrenceRule();
  rule.hour = 0;
  rule.minute = 0;
  schedule.scheduleJob(rule, async () => {
    await logger.logToChannel('Restarting...');
    pm2.restart('STOCK BOT', async err => {
      if (err) {
        await logger.logError(err);
      }
    });
  });
};
