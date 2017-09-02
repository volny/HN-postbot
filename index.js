// TODO before production:
// we need 'moderation' - can't post all items at the speed of node
// (1) the cron job to execute this should run every random number of minutes between 30 - 90
// (2) after posting a story we should sleep for 1-3 minutes before posting the next

const puppeteer = require('puppeteer')
const login = require('./hnLogin').login
const getStories = require('./techmeme').getStories
const filterPosted = require('./algolia').filterPosted
const postStory = require('./hnPost.js').postStory

;(async () => {
  try {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()

    // fetch the stories object from techmeme
    const submissionsList = await getStories(page)
    // check with hn API which haven't been posted and filter
    const unpostedStories = await filterPosted(submissionsList)
    // login to hn
    await login(page)
    // post stories
    post all stories
    for (let story of unpostedStories) {
      await postStory(page, story)
    }

    browser.close()
  } catch (error) {
    console.error(error)
  }
})()
