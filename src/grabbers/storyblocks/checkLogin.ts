import { Page } from 'puppeteer';
import { Selectors } from '../../helpers';

export async function isStoryblocksLoggedIn(page: Page): Promise<boolean> {
  const accountButton = await page.$(Selectors.STORYBLOCKS_ACCOUNT_BUTTON);
  return !!accountButton;
}
