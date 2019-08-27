import * as fse from 'fs-extra';

export async function waitUntilFileIsCreated(path: string): Promise<void> {
  return new Promise<void>(resolve => {
    const timerId = setInterval(() => {
      fse.pathExists(path)
        .then(exists => {
          if (exists) {
            clearInterval(timerId);
            resolve();
          }
        });
    }, 1000);
  });
}
