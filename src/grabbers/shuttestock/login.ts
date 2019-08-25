import { browserPromise } from '../../helpers/browserPromise';
import { Selectors } from '../../helpers/selectors';
import { getRandomInt } from '../../helpers/getRandomInt';

export async function loginShutterstock() {
  const { SHUTTER_LOGIN, SHUTTER_PASS } = process.env;
  if (!SHUTTER_LOGIN || !SHUTTER_PASS) {
    process.exit(1);
    throw new Error('No shutterstock creds specified!');
  }
  console.log('Logging in to shutterstock...');
  const browser = await browserPromise;
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720 });
  await page.goto('https://www.shutterstock.com/login');
  await page.waitFor(Selectors.SHUTTER_LOGIN_BUTTON);
  if (page.url() === 'https://www.shutterstock.com/home') {
    console.log('Shutterstock already logged in!');
    return;
  }
  await page.waitFor(getRandomInt(1000, 3000));
  await page.click(Selectors.SHUTTER_LOGIN_FIELD);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.keyboard.type(SHUTTER_LOGIN);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.click(Selectors.SHUTTER_PASS_FIELD);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.keyboard.type(SHUTTER_PASS);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.click(Selectors.SHUTTER_LOGIN_BUTTON);
  try {
    await page.waitFor(Selectors.SHUTTER_FOOTER, { timeout: 10000 });
  } catch (e) {
    console.error('Unable to log in to shutterstock!');
    process.exit(1);
  }
  console.log('Shutterstock logged in!');
  await page.close();
}
