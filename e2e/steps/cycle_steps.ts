import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';


Given('a cycle task {string} exists', async ({ page }, title) => {
    // Setup
});

When('I enter title {string}', async ({ page }, title) => {
    await page.fill('input[name="title"]', title);
});

When('I select day {string}', async ({ page }, day) => {
    await page.selectOption('select[name="day"]', day);
});

When('I select time slot {string}', async ({ page }, slot) => {
    await page.selectOption('select[name="timeSlot"]', slot);
});

When('I click {string} in the list', async ({ page }, title) => {
    await page.click(`text=${title}`);
});

When('I edit the task to {string}', async ({ page }, newTitle) => {
    await page.fill('input[name="title"]', newTitle);
    await page.click('text=Save');
});

Then('the list shows {string}', async ({ page }, title) => {
    await expect(page.locator(`text=${title}`)).toBeVisible();
});

Then('I see {string} in the list of cycle tasks', async ({ page }, title) => {
    await expect(page.locator(`text=${title}`)).toBeVisible();
});

Then('existing sprints are NOT updated \\(as per Rule 7 in FIX.md\\)', async ({ page }) => {
    // Check sprint
});

When('I delete {string}', async ({ page }, title) => {
    await page.click(`text=${title}`); // open it
    await page.click('text=Delete');
});

Then('it is removed from the cycle list', async ({ page }, title) => {
    await expect(page.locator(`text=${title}`)).not.toBeVisible();
});

Then('existing tickets spawned from this cycle remain in the current sprint', async ({ page }) => {
    // Check board
});
