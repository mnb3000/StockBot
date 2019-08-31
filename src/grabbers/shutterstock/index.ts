import * as fse from 'fs-extra';
import {
  browserPromise, downloadFolderPath, logger, Selectors, waitUntilFileIsCreated,
} from '../../helpers';
import { isShutterstockLoggedIn } from './checkLogin';

export async function downloadShutterstockImage(url: string): Promise<string | undefined> {
  const shutterDownloadFolderPath = `${downloadFolderPath}/shutterstock`;
  const browser = await browserPromise;
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720 });
  const res = await page.goto(url);
  await page.waitFor(Selectors.SHUTTER_CONTENT_PAGE);
  if (!res || !res.ok()) {
    await logger.logError(new Error('Invalid shutterstock url!'));
    await page.close();
    return undefined;
  }
  const loggedIn = await isShutterstockLoggedIn(page);
  if (!loggedIn) {
    await logger.logError(new Error('Shutterstock not logged in!'));
    await page.close();
    return undefined;
  }
  const fileId = await page.$eval(Selectors.SHUTTER_FILE_ID, elem => elem.textContent!.match(/(\d+)/)![1]);
  const pathArr = [
    `${shutterDownloadFolderPath}/shutterstock_${fileId}.eps`,
    `${shutterDownloadFolderPath}/shutterstock_${fileId}.jpg`,
  ];
  const existsArr = await Promise.all(pathArr.map(path => fse.pathExists(path)));
  if (existsArr.includes(true)) {
    await page.close();
    return pathArr[existsArr.indexOf(true)];
  }
  await page.click(Selectors.SHUTTER_DOWNLOAD_BUTTON);
  await page.waitFor(Selectors.SHUTTER_DOWNLOAD_CONFIRM_BUTTON);
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: shutterDownloadFolderPath,
  });
  await page.click(Selectors.SHUTTER_DOWNLOAD_CONFIRM_BUTTON);
  await page.waitFor(Selectors.SHUTTER_MANUAL_DOWNLOAD_BUTTON);
  await page.waitFor(5000);
  const fileLink = await page.$eval(Selectors.SHUTTER_MANUAL_DOWNLOAD_BUTTON, link => link.getAttribute('href'));
  if (!fileLink) {
    await page.close();
    return undefined;
  }
  const fileName = fileLink.split('/').pop();
  const filePath = `${shutterDownloadFolderPath}/${fileName}`;
  await page.close();
  await waitUntilFileIsCreated(filePath);
  logger.incrementDownloads();
  return filePath;
}

export * from './login';
