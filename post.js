const { postHasSucceeded, storyPostedAlready, writeNewQueue, takeOffCue, postIfNew } = require('./utils')


const URI = 'https://news.ycombinator.com/submit'
const TITLE_SELECTOR = 'input[name="title"]'
const LINK_SELECTOR = 'input[name="url"]'
const BUTTON_SELECTOR = 'input[type="submit"]'

// TODO: probably postIfNew should be here
// TODO: and postHasSucceeded should be here too
module.exports.postStory = async (page, story) => {
  try {
    await page.goto(URI)
    await page.click(TITLE_SELECTOR)
    await page.type(story.title)
    await page.click(LINK_SELECTOR)
    await page.type(story.link)
    await page.click(BUTTON_SELECTOR)
    await page.waitForNavigation()
  } catch (error) {
    console.error('Error in postHN.js', error)
  }
}
    // TODO
    // const succeeded = await postHasSucceeded(story.link)
    // if (succeeded) {
    //   console.log(hasSucceeded ? 'Post succeeded:' : 'Posting failed:', story.title)
    //   await writeNewQueue(newQueue)
    // }

