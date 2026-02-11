import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';

When('I click {string}', async ({ page }, text) => {
    await page.click(`text=${text}`);
});

When('I visit {string}', async ({ page }, url) => {
    await page.goto(url);
});

When('I type {string} in {string}', async ({ page }, text, selector) => {
    await page.fill(selector, text);
});
