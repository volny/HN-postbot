const puppeteer = require('puppeteer')
const argv = require('minimist')(process.argv.slice(2))

const login = require('./login').login
const getStories = require('./techmeme').getStories
const postStory = require('./post').postStory
const filterPosted = require('./request').filterPosted
const postHasSucceeded = require('./request').postHasSucceeded

const DEBUG = true
const postArg = argv.post
const queueArg = argv['build-queue']

queueArg && (() => {
  console.log('Building Queue...')
})()

postArg && (() => {
  console.log('Posting Story...')
})()

!queueArg && !postArg && console.log('What do you want to do? Please supply arguments --build-queue or --post')

// ;(async () => {
//   console.dir(process.argv.slice(2))
//   try {
//     const browser = await puppeteer.launch({headless: !DEBUG})
//     const page = await browser.newPage()
//
//     // fetch the stories object from techmeme
//     const submissionsList = await getStories(page)
//     // check with hn API which haven't been posted and filter
//     const unpostedStories = await filterPosted(submissionsList)
//     // login to hn
//     await login(page)
//     // post stories and check if post succeeded
//     for (let story of unpostedStories) {
//       await postStory(page, story)
//       const hasSucceeded = await postHasSucceeded(story.link)
//       console.log(hasSucceeded ? 'Success:' : 'Failure:', story.title)
//     }
//
//     browser.close()
//   } catch (error) {
//     console.error(error)
//   }
// })()
