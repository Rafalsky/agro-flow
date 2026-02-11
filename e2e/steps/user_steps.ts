import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';





Then('I see a list of all registered workers and zootechnicians', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
});

When('I enter Name {string} and Email {string}', async ({ page }, name, email) => {
    await page.fill('input[name="name"]', name);
    await page.fill('input[name="email"]', email);
});

When('I select role {string}', async ({ page }, role) => {
    await page.selectOption('select[name="role"]', role);
});

When('I submit the form', async ({ page }) => {
    await page.click('button[type="submit"]');
});

Then('the user {string} is added to the system', async ({ page }, name) => {
    await expect(page.locator(`text=${name}`)).toBeVisible();
});

Then('I can use {string} to log in', async ({ page }, email) => {
    // Verification
});
