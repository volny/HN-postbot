const { storyPostedAlready, writeNewQueue, postHasSucceeded } = require('./utils')

const URI = 'https://news.ycombinator.com/submit'
const TITLE_SELECTOR = 'input[name="title"]'
const LINK_SELECTOR = 'input[name="url"]'
const BUTTON_SELECTOR = 'input[type="submit"]'

// TODO check if title is too long, if so change it or skip

const takeOffCue = async (queue) => {
  const story = queue[queue.length - 1]
  const newQueue = queue.slice(0, queue.length - 1)
  return [newQueue, story]
}

const postIfNew = async (page, queue, story) => {
  const postedAlready = await storyPostedAlready(story)
  if (!postedAlready) {
    await postStory(page, story)
    return [queue, story]
  }

  if (queue.length < 1) {
    return [queue, story]
  }

  const [newQueue, newStory] = await takeOffCue(queue)

  // already posted - try next story in the queue
  return await postIfNew(page, newQueue, newStory)
}

const postStory = async (page, story) => {
  try {
    await page.goto(URI)
    await page.click(TITLE_SELECTOR)
    await page.type(story.title)
    await page.click(LINK_SELECTOR)
    await page.type(story.link)
    await page.click(BUTTON_SELECTOR)
    await page.waitForNavigation()
  } catch (error) {
    console.error(error)
  }
}

const postNext = async (page, queue) => {
  const [newQueue, story] = await postIfNew(page, queue)
  if (story) {
    const succeeded = await postHasSucceeded(story.link)
    if (succeeded) {
      console.log('Posting succeeded:', story.title)
      // after successful post we take it off the queue
      await writeNewQueue(newQueue)
    } else {
      console.log('Posting failed:', story.title)
    }
  } else {
    console.log('Nothing to post. Moving on.')
  }
  return newQueue
}

module.exports.postNext = postNext
