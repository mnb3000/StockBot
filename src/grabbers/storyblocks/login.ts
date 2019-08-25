import { browserPromise, Selectors, getRandomInt } from '../../helpers';

export async function loginStoryblocks() {
  const { STORYBLOCKS_LOGIN, STORYBLOCKS_PASS } = process.env;
  if (!STORYBLOCKS_LOGIN || !STORYBLOCKS_PASS) {
    process.exit(1);
    throw new Error('No storyblocks creds specified!');
  }
  console.log('Logging in to storyblocks...');
  const browser = await browserPromise;
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720 });
  await page.goto('https://www.storyblocks.com/login');
  await page.waitFor(Selectors.STORYBLOCKS_LOGIN_BUTTON);
  if (page.url() === 'https://www.storyblocks.com/') {
    console.log('Storyblocks already logged in!');
    return;
  }
  await page.waitFor(getRandomInt(1000, 3000));
  await page.click(Selectors.STORYBLOCKS_LOGIN_FIELD);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.keyboard.type(STORYBLOCKS_LOGIN);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.click(Selectors.STORYBLOCKS_PASS_FIELD);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.keyboard.type(STORYBLOCKS_PASS);
  await page.waitFor(getRandomInt(1000, 3000));
  await page.click(Selectors.STORYBLOCKS_LOGIN_BUTTON);
  try {
    await page.waitFor(Selectors.STORYBLOCKS_HOME, { timeout: 10000 });
  } catch (e) {
    console.error('Unable to log in to storyblocks!');
    process.exit(1);
  }
  console.log('Storyblocks logged in!');
  await page.close();
}
