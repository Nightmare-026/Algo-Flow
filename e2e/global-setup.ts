import { FullConfig, chromium } from "@playwright/test";

export default async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(config.projects[0].use?.baseURL || "http://127.0.0.1:3100");
  // Set a flag in localStorage to indicate test mode
  await page.evaluate(() => {
    localStorage.setItem("playwright-test-mode", "true");
  });
  await browser.close();
}