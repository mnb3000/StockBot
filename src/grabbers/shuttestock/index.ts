import { browserPromise } from '../../helpers/browserPromise';
import { isShutterstockLoggedIn } from './checkLogin';
import { logger } from '../../helpers/logger';
import { Selectors } from '../../helpers/selectors';

export async function downloadShutterstockImage(url: string) {
  const browser = await browserPromise;
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720 });
  const res = await page.goto(url);
  await page.waitFor('#content,.body-content');
  if (!res || !res.ok()) {
    await logger.logError(new Error('Invalid shutterstock url!'));
    await page.close();
    return;
  }
  const loggedIn = await isShutterstockLoggedIn(page);
  if (!loggedIn) {
    await logger.logError(new Error('Shutterstock not logged in!'));
    await page.close();
    return;
  }
  await page.click(Selectors.SHUTTER_DOWNLOAD_BUTTON);
}

export * from './login';
