const puppeteer = require('puppeteer')
const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs-extra')

const { login } = require('./login')
const { getStories } = require('./techmeme')
const { postStory } = require('./post')
const { filterStoryList, postHasSucceeded } = require('./utils')

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
  // fs-extra returns a promise :)
  await fs.writeFile('./output/queue.json', JSON.stringify(unpostedStories))

  browser.close()
})()

// TODO: if no queue then build one
postArg && (async () => {
  console.log('Posting Story from Queue...')
  const browser = await puppeteer.launch({headless: !DEBUG})
  const page = await browser.newPage()
  // login to hn
  await login(page)

  const takeOffCue = (queue) => {
    // read queue file and assign it to const queue
    const story = queue[0]
    const newQueue = queue.slice(1, queue.length)
    return [newQueue, story]
  }
  // recursive postStory checks if story has already been posted, if so takes the next item off the queue, if not posts it
  const postIfNew = async (queue, story) => {
    if (!hasBeenPostedAlready(story)) {
      // post story
      await postStory(story)
      // check if posting succeeded

      return newQueue
    }

    // already posted - try next story in the queue
    postIfNew([...takeOffCue(queue)])
  }

  // TODO: read queue from fs
  const queue = {}
  const newQueue = postIfNew(queue)
  // TODO: rewrite queue file

  // TODO: Story(page, story)
  const hasSucceeded = await postHasSucceeded(story.link)
  console.log(hasSucceeded ? 'Post succeeded:' : 'Posting failed:', story.title)

  browser.close()
})()

!queueArg && !postArg && console.log('What do you want to do? Please supply arguments --build-queue or --post')
