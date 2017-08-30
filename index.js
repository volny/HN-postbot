const puppeteer = require('puppeteer');

const URI = 'https://news.ycombinator.com/login'
const USERNAME_SELECTOR = 'body > div > form:nth-child(4) > table > tbody > tr:nth-child(1) > td:nth-child(2) > input[type="text"]'
const PASSWORD_SELECTOR = 'body > div > form:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="password"]'
const BUTTON_SELECTOR = 'body > div > form:nth-child(4) > input[type="submit"]'

const login = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({path: 'example.png'});

  browser.close();
}

