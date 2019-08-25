import { browserPromise, Selectors, getRandomInt } from '../../helpers';

export async function loginVideoblocks() {
  const { VIDEOBLOCKS_LOGIN, VIDEOBLOCKS_PASS } = process.env;
  if (!VIDEOBLOCKS_LOGIN || !VIDEOBLOCKS_PASS) {
    process.exit(1);
    throw new Error('No videoblocks creds specified!');
  }
  console.log('Logging in to videoblocks...');
  const browser = await browserPromise;
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720 });
  await page.goto('https://www.videoblocks.com/login');
  await page.waitFor(Selectors.VIDEOBLOCKS_LOGIN_BUTTON);
  if (page.url() === 'https://www.videoblocks.com/') {
    console.log('Videoblocks already logged in!');
    return;
  }
  await page.waitFor(getRandomInt(1000, 3000));
  await page.click(Selectors.VIDEOBLOCKS_LOGIN_FIELD);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.keyboard.type(VIDEOBLOCKS_LOGIN);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.click(Selectors.VIDEOBLOCKS_PASS_FIELD);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.keyboard.type(VIDEOBLOCKS_PASS);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.click(Selectors.VIDEOBLOCKS_LOGIN_BUTTON);
  try {
    await page.waitFor(Selectors.VIDEOBLOCKS_HOME, { timeout: 10000 });
  } catch (e) {
    console.error('Unable to log in to videoblocks!');
    process.exit(1);
  }
  console.log('Videoblocks logged in!');
  await page.close();
}
