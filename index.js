const DEBUG = true

const puppeteer = require('puppeteer')
const login = require('./hnLogin').login
const getStories = require('./techmeme').getStories
const filterPosted = require('./algolia').filterPosted
const postStory = require('./hnPost.js').postStory
const postHasSucceeded = require('./confirm.js').postHasSucceeded

;(async () => {
  try {
    const browser = await puppeteer.launch({headless: !DEBUG})
    const page = await browser.newPage()

    // fetch the stories object from techmeme
    const submissionsList = await getStories(page)
    // check with hn API which haven't been posted and filter
    const unpostedStories = await filterPosted(submissionsList)
    // login to hn
    await login(page)
    // post stories and check if post succeeded
    for (let story of unpostedStories) {
      await postStory(page, story)
      const hasSucceeded = await postHasSucceeded(story.link)
      console.log(hasSucceeded ? 'Success:' : 'Failure:', story.title)
    }

    browser.close()
  } catch (error) {
    console.error(error)
  }
})()
