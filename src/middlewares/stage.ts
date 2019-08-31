import { Stage } from 'telegraf';
import { authScene } from '../scenes';
import { downloadScene } from '../scenes/download';

export const stage = new Stage([authScene, downloadScene]);
