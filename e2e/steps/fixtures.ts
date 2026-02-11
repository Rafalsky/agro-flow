import { test as base, createBdd } from 'playwright-bdd';
import { Page, BrowserContext } from '@playwright/test';

type MyFixtures = {
    zooContext: BrowserContext;
    zooPage: Page;
    workerContext: BrowserContext;
    workerPage: Page;
};

export const test = base.extend<MyFixtures>({
    zooContext: async ({ browser }, use) => {
        const context = await browser.newContext();
        await use(context);
        await context.close();
    },
    zooPage: async ({ zooContext }, use) => {
        const page = await zooContext.newPage();
        await use(page);
    },
    workerContext: async ({ browser }, use) => {
        const context = await browser.newContext();
        await use(context);
        await context.close();
    },
    workerPage: async ({ workerContext }, use) => {
        const page = await workerContext.newPage();
        await use(page);
    },
});

export const { Given, When, Then } = createBdd(test);
