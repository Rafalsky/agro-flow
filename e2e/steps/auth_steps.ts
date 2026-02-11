import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';

// --- Background / Common ---

Given('I am on the login page', async ({ page }) => {
    await page.goto('/login');
});

// --- Scenarios ---

Given('a user {string} exists with email {string}', async ({ page }, role, email) => {
    // In a real test, we might seed the DB here.
    // For now, we assume the seed data already has these users or we'll mock it if strict purity needed.
});

Given('no user exists with email {string}', async ({ page }, email) => {
    // Ensure this user doesn't exist or assume it doesn't.
});

When('I enter email {string}', async ({ page }, email) => {
    // Navigate to login if not already there (though Background puts us there)
    await page.fill('input[type="email"]', email);
});



When('I visit the magic link sent to {string}', async ({ page }, email) => {
    // In dev environment, we use pre-seeded tokens for standard emails.
    // zootech@agro.flow -> dev-zootech
    // worker@agro.flow -> dev-worker-1
    let token = '';
    if (email.includes('zootech')) token = 'dev-zootech';
    else if (email.includes('worker')) token = 'dev-worker-1';

    if (token) {
        await page.goto(`/api/auth/magic?token=${token}`);
    } else {
        throw new Error(`No dev token mapped for email: ${email}`);
    }
});

Then('I am redirected to the board', async ({ page }) => {
    await page.waitForURL(/\/board/);
});

Then('I see {string} controls', async ({ page }, role) => {
    if (role === 'Zootechnician') {
        await expect(page.locator('text=New Ticket')).toBeVisible();
        await expect(page.locator('text=Users')).toBeVisible();
    }
});

Then('I see {string} view \\(limited controls\\)', async ({ page }, role) => {
    if (role === 'Worker') {
        await expect(page.locator('text=New Ticket')).not.toBeVisible();
    }
});

Then('I see an error message {string}', async ({ page }, msg) => {
    await expect(page.locator(`text=${msg}`)).toBeVisible();
});

Given('I am logged in as a {string}', async ({ page }, role) => {
    const token = role === 'Zootechnician' ? 'dev-zootech' : 'dev-worker-1';
    await page.goto(`/api/auth/magic?token=${token}`);
    await page.waitForURL(/\/board/);
});

Given('I am logged in as {string}', async ({ page }, role) => {
    const email = role === 'Zootechnician' ? 'zootech@agro.flow' : 'worker@agro.flow';
    await page.goto(`/api/auth/magic?email=${email}`);
    await page.waitForURL(/\/board/);
});

When('I attempt to visit {string}', async ({ page }, url) => {
    await page.goto(url);
});

Then('I am redirected to {string} or see {string}', async ({ page }, url, msg) => {
    try {
        await expect(page).toHaveURL(new RegExp(url));
    } catch {
        await expect(page.locator(`text=${msg}`)).toBeVisible();
    }
});
