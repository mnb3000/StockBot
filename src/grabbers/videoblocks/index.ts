import * as fse from 'fs-extra';
import {
  browserPromise, downloadFolderPath, logger, Selectors, waitUntilFileIsCreated,
} from '../../helpers';
import { isStoryblocksLoggedIn } from '../storyblocks/checkLogin';

export async function downloadVideoblocksVideo(url: string): Promise<string | undefined> {
  const videoblocksDownloadFolderPath = `${downloadFolderPath}/videoblocks`;
  const browser = await browserPromise;
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720 });
  const res = await page.goto(url);
  await page.waitFor(Selectors.STORYBLOCKS_CONTENT_PAGE);
  if (!res || !res.ok()) {
    await logger.logError(new Error('Invalid videoblocks url!'));
    await page.close();
    return undefined;
  }
  const loggedIn = await isStoryblocksLoggedIn(page);
  if (!loggedIn) {
    await logger.logError(new Error('Storyblocks not logged in!'));
    await page.close();
    return undefined;
  }
  const fileName = await page.$eval(Selectors.VIDEOBLOCKS_VIDEO_URL, elem => elem.getAttribute('content')!.split('/').pop()!.replace('__WL', '__D').replace('.mp4', ''));
  const pathArr = [
    `${videoblocksDownloadFolderPath}/${fileName}.mp4`,
    `${videoblocksDownloadFolderPath}/${fileName}.mov`,
  ];
  const existsArr = await Promise.all(pathArr.map(path => fse.pathExists(path)));
  if (existsArr.includes(true)) {
    await page.close();
    return pathArr[existsArr.indexOf(true)];
  }
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: videoblocksDownloadFolderPath,
  });
  const hdmp4 = await page.$(Selectors.VIDEOBLOCKS_HDMP4);
  const format = hdmp4 ? 'mp4' : 'mov';
  const filePath = `${videoblocksDownloadFolderPath}/${fileName}.${format}`;
  if (hdmp4) {
    await page.click(Selectors.VIDEOBLOCKS_HDMP4);
    await page.waitFor(500);
  }
  await page.click(Selectors.STORYBLOCKS_DOWNLOAD_BUTTON);
  await page.waitFor(5000);
  await page.close();
  await waitUntilFileIsCreated(filePath);
  return filePath;
}
