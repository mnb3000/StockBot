import { Page } from 'puppeteer';
import { Selectors } from '../../helpers/selectors';

export async function isShutterstockLoggedIn(page: Page): Promise<boolean> {
  const downloadButton = await page.$(Selectors.SHUTTER_DOWNLOAD_BUTTON);
  return !!downloadButton;
}
