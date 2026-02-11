import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';

Given('a ticket {string} exists', async ({ page }, title) => {
    // Prerequisite
});

When('I open ticket {string}', async ({ page }, title) => {
    await page.click(`text=${title}`);
});

When('I type {string} in the comment box', async ({ page }, text) => {
    await page.fill('textarea', text);
});



Then('the comment {string} appears in the ticket history', async ({ page }, text) => {
    await expect(page.locator(`text=${text}`)).toBeVisible();
});

Then('{string} can see the comment', async ({ page }, role) => {
    // Check visibility
});
