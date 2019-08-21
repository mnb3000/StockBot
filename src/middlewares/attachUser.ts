import { ContextMessageUpdate } from 'telegraf';
import { report } from '../helpers/report';
import { bot } from '../helpers';
import { User } from '../entities';

export async function attachUser(ctx: ContextMessageUpdate, next?: () => any) {
  if (!next) {
    return;
  }
  try {
    if (!ctx.from) {
      return;
    }
    let user = await User.findOne(ctx.from.id);
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
    await report(bot, e);
  }
  next();
}
