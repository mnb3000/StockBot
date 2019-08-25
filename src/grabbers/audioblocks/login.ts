import { browserPromise, Selectors, getRandomInt } from '../../helpers';

export async function loginAudioblocks() {
  const { AUDIOBLOCKS_LOGIN, AUDIOBLOCKS_PASS } = process.env;
  if (!AUDIOBLOCKS_LOGIN || !AUDIOBLOCKS_PASS) {
    process.exit(1);
    throw new Error('No audioblocks creds specified!');
  }
  console.log('Logging in to audioblocks...');
  const browser = await browserPromise;
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720 });
  await page.goto('https://www.audioblocks.com/login');
  await page.waitFor(Selectors.AUDIOBLOCKS_LOGIN_BUTTON);
  if (page.url() === 'https://www.audioblocks.com/') {
    console.log('Audioblocks already logged in!');
    return;
  }
  await page.waitFor(getRandomInt(1000, 3000));
  await page.click(Selectors.AUDIOBLOCKS_LOGIN_FIELD);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.keyboard.type(AUDIOBLOCKS_LOGIN);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.click(Selectors.AUDIOBLOCKS_PASS_FIELD);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.keyboard.type(AUDIOBLOCKS_PASS);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.click(Selectors.AUDIOBLOCKS_LOGIN_BUTTON);
  try {
    await page.waitFor(Selectors.AUDIOBLOCKS_HOME, { timeout: 10000 });
  } catch (e) {
    console.error('Unable to log in to audioblocks!');
    process.exit(1);
  }
  console.log('Audioblocks logged in!');
  await page.close();
}
