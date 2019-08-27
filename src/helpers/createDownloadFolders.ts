import * as path from 'path';
import * as fse from 'fs-extra';

export const downloadFolderPath = path.resolve('downloads');

export async function createDownloadFolders() {
  await fse.ensureDir(downloadFolderPath);
  await Promise.all([
    fse.ensureDir(`${downloadFolderPath}/shutterstock`),
    fse.ensureDir(`${downloadFolderPath}/storyblocks`),
    fse.ensureDir(`${downloadFolderPath}/audioblocks`),
    fse.ensureDir(`${downloadFolderPath}/videoblocks`),
  ]);
}
