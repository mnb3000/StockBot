import { SceneContextMessageUpdate } from 'telegraf';
import { User } from '../entities';
import { logger } from '../helpers/logger';

export async function attachUser(ctx: SceneContextMessageUpdate, next?: () => any) {
  if (!next) {
    return;
  }
  try {
    if (!ctx.from) {
      return;
    }
    let user = await User.findOne({ where: { tgId: ctx.from.id } });
    if (!user) {
      user = new User();
      user.tgId = ctx.from.id;
    }
    user.firstName = ctx.from.first_name;
    user.lastName = ctx.from.last_name;
    user.username = ctx.from.username;
    await user.save();
    ctx.dbUser = user;
  } catch (e) {
    await logger.logError(e);
  }
  next();
}
