const puppeteer = require('puppeteer')
const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs-extra')

const { login } = require('./login')
const { getStories } = require('./techmeme')
const { filterStoryList, postHasSucceeded, storyPostedAlready, writeNewQueue,takeOffCue, postIfNew } = require('./utils')

const DEBUG = true

// TODO do this in a sane way - without the iife's - just a proper if/else at the end of file (separate the arg processing from doing our magic)
const postArg = argv.post
const queueArg = argv['build-queue']

queueArg && (async () => {
  console.log('Building Queue...')
  const browser = await puppeteer.launch({headless: !DEBUG})
  const page = await browser.newPage()
  // fetch stories from techmeme
  const submissionsList = await getStories(page)
  // filter what has already been posted
  const unpostedStories = await filterStoryList(submissionsList)

  await writeNewQueue(unpostedStories)

  browser.close()
})()

// TODO: if no queue then build one
postArg && (async () => {
  console.log('Posting Story from Queue...')
  const browser = await puppeteer.launch({headless: !DEBUG})
  const page = await browser.newPage()
  // login to hn
  await login(page)

  try {
    const queueString = await fs.readFile('./output/queue.json')
    const queue = JSON.parse(queueString)

    const newQueue = await postIfNew(queue)

    // todo writeNewQueue will be called from post.js!
    await writeNewQueue(newQueue)

    return

  } catch (error) {
    if (error.code === 'ENOENT') {
      // TODO there is no queue - make one
      // TODO recursively start over
    } else {
      console.error(error)
    }
  }

  browser.close()
})()

!queueArg && !postArg && console.log('What do you want to do? Please supply arguments --build-queue or --post')
