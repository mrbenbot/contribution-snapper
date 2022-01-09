import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto("https://github.com/mrbenbot", {
  waitUntil: "networkidle2",
});
await page.waitForSelector(".js-calendar-graph");

const element = await page.$(".js-calendar-graph");
await element?.screenshot({ path: "./image.jpeg", quality: 100 });

await browser.close();
