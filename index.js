const puppeteer = require('puppeteer')
const secrets = require('./secrets.js')

const URI = 'https://news.ycombinator.com/login'

// TODO these selectors for not unique on the page, the signup form below uses the same.
// currently only works because we are returned the first match, which happens to be what we want
const USERNAME_SELECTOR = 'input[type="text"][name="acct"]'
const PASSWORD_SELECTOR = 'input[type="password"][name="pw"]'
const BUTTON_SELECTOR = 'input[type="submit"][value="login"]'

const login = async (page) => {
  try {
    await page.click(USERNAME_SELECTOR)
    await page.type(secrets.username)
    await page.click(PASSWORD_SELECTOR)
    await page.type(secrets.password)
    await page.click(BUTTON_SELECTOR)
    await page.waitForNavigation()

  } catch (error) {
    console.error(error)
  }
}

const getInnerHTML = async (page, selector) => {
  try {
    return await page.evaluate((selector) => {
      const element = document.querySelector(selector)
      return element ? element.innerHTML : null
    }, selector)
  } catch (error) {
    console.error(error)
  }
}

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(URI)

  await login(page)

  await page.goto(`https://news.ycombinator.com/user?id=${secrets.username}`)
  const createdAtSelector = '#hnmain > tbody > tr:nth-child(3) > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2)'
  const createdAt = await getInnerHTML(page, createdAtSelector)
  console.log(createdAt)

  browser.close()
})()
