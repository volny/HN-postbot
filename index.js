const puppeteer = require('puppeteer')
const login = require('./hnLogin').login
const getStories = require('./techmeme').getStories

;(async () => {
  try {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()

    // fetch the stories object from techmeme
    const submissionsList = await getStories(page)
    console.log(submissionsList)
    // check with hn API which haven't been posted and filter

    // login to hn
    // await login(page)

    // post all stories

    browser.close()
  } catch (error) {
    console.error(error)
  }
})()
