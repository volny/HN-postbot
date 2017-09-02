// take in a story object and post it to hn

const URI = 'https://news.ycombinator.com/submit'
const TITLE_SELECTOR = 'input[name="title"]'
const LINK_SELECTOR = 'input[name="url"]'
const BUTTON_SELECTOR = 'input[type="submit"]'

module.exports = {
  postStory: async (page, story) => {
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
}
