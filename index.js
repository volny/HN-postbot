const puppeteer = require('puppeteer')
const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs-extra')

const { login } = require('./login')
const { getStories } = require('./techmeme')
const { postNext } = require('./post')
const { filterStoryList, writeNewQueue } = require('./utils')

const DEBUG = true

const buildQueue = async () => {
  console.log('Building Queue...')
  const browser = await puppeteer.launch({headless: !DEBUG})
  const page = await browser.newPage()
  // fetch stories from techmeme
  const submissionsList = await getStories(page)
  // filter what has already been posted
  const unpostedStories = await filterStoryList(submissionsList)

  await writeNewQueue(unpostedStories)

  browser.close()

  return unpostedStories
}

const post = async () => {
  console.log('Posting Story from Queue...')
  const browser = await puppeteer.launch({headless: !DEBUG})
  const page = await browser.newPage()

  await login(page)

  try {
    const queueString = await fs.readFile('./output/queue.json')
    const queue = JSON.parse(queueString)

    try {
      const newQueue = await postNext(page, queue)

      if (newQueue.length < 1) {
        console.log('Queue is empty. Rebuilding ...')
        const rebuiltQueue = await buildQueue()
        console.log({rebuiltQueue})
        if (rebuiltQueue.length < 1) {
          console.log('All Stories have been posted. Done.')
          return
        }
      }
    } catch (error) {
      console.log('Something went wrong with posting the story\n', error)
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      await buildQueue()
      return await post()
    } else {
      console.error(error)
    }
  }

  browser.close()
}

const postArg = argv.post
const queueArg = argv['build-queue']
queueArg && buildQueue()
postArg && post()
!queueArg && !postArg && console.log('What do you want to do? Please supply arguments --build-queue or --post')
