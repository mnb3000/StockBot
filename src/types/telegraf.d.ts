import { User } from '../entities';

declare module 'telegraf' {
  export class ContextMessageUpdate {
    public dbUser: User;
  }
}
