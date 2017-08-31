const secrets = require('./secrets.js')

const URI = 'https://news.ycombinator.com/login'
const USERNAME_SELECTOR = 'input[type="text"][name="acct"]'
const PASSWORD_SELECTOR = 'input[type="password"][name="pw"]'
const BUTTON_SELECTOR = 'input[type="submit"][value="login"]'

module.exports = {
  login: async (page) => {
    try {
      await page.goto(URI)
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
}
