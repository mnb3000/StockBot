import * as fse from 'fs-extra';
import {
  browserPromise, downloadFolderPath, logger, Selectors, waitUntilFileIsCreated,
} from '../../helpers';
import { isStoryblocksLoggedIn } from '../storyblocks/checkLogin';

export async function downloadAudioblocksAudio(url: string): Promise<string | undefined> {
  const audioblocksDownloadFolderPath = `${downloadFolderPath}/audioblocks`;
  const browser = await browserPromise;
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720 });
  const res = await page.goto(url);
  const content = await page.$(Selectors.STORYBLOCKS_CONTENT_PAGE);
  if (!res || !res.ok() || !content) {
    await logger.logError(new Error('Invalid audioblocks url!'));
    await page.close();
    return undefined;
  }
  const loggedIn = await isStoryblocksLoggedIn(page);
  if (!loggedIn) {
    await logger.logError(new Error('Storyblocks not logged in!'));
    await page.close();
    return undefined;
  }
  const fileName = await page.$eval(Selectors.AUDIOBLOCKS_AUDIO_URL, elem => elem.getAttribute('content')!.split('/').pop());
  const filePath = `${audioblocksDownloadFolderPath}/${fileName}`;
  if (await fse.pathExists(filePath)) {
    await page.close();
    return filePath;
  }
  if (!(await page.$(Selectors.STORYBLOCKS_MEMBER_LIBRARY))) {
    return undefined;
  }
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: audioblocksDownloadFolderPath,
  });
  await page.click(Selectors.STORYBLOCKS_DOWNLOAD_BUTTON);
  await page.waitFor(5000);
  await page.close();
  await waitUntilFileIsCreated(filePath);
  logger.incrementDownloads();
  return filePath;
}
