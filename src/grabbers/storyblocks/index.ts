import * as fse from 'fs-extra';
import {
  browserPromise, downloadFolderPath, logger, Selectors, waitUntilFileIsCreated,
} from '../../helpers';
import { isStoryblocksLoggedIn } from './checkLogin';

export async function downloadStoryblocksImage(url: string): Promise<string | undefined> {
  const storyblocksDownloadFolderPath = `${downloadFolderPath}/storyblocks`;
  const browser = await browserPromise;
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720 });
  const res = await page.goto(url);
  const content = await page.$(Selectors.STORYBLOCKS_CONTENT_PAGE);
  if (!res || !res.ok() || !content) {
    await logger.logError(new Error('Invalid storyblocks url!'));
    await page.close();
    return undefined;
  }
  const loggedIn = await isStoryblocksLoggedIn(page);
  if (!loggedIn) {
    await logger.logError(new Error('Storyblocks not logged in!'));
    await page.close();
    return undefined;
  }
  const fileName = await page.$eval(Selectors.STORYBLOCKS_IMAGE_URL, elem => elem.getAttribute('content')!.split('/').pop()!.replace('_thumb.jpg', ''));
  const pathArr = [
    `${storyblocksDownloadFolderPath}/${fileName}.eps`,
    `${storyblocksDownloadFolderPath}/${fileName}.jpg`,
  ];
  const existsArr = await Promise.all(pathArr.map(path => fse.pathExists(path)));
  if (existsArr.includes(true)) {
    await page.close();
    return pathArr[existsArr.indexOf(true)];
  }
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: storyblocksDownloadFolderPath,
  });
  const eps = await page.$(Selectors.STORYBLOCKS_EPS);
  const format = eps ? 'eps' : 'jpg';
  const filePath = `${storyblocksDownloadFolderPath}/${fileName}.${format}`;
  if (eps) {
    await page.click(Selectors.STORYBLOCKS_EPS);
    await page.waitFor(500);
  }
  await page.click(Selectors.STORYBLOCKS_DOWNLOAD_BUTTON);
  await page.waitFor(5000);
  await page.close();
  await waitUntilFileIsCreated(filePath);
  logger.incrementDownloads();
  return filePath;
}

export * from './login';
