const puppeteer = require('puppeteer')

const URI = 'https://www.techmeme.com/river'

// // get the number of articles of the current day
// const length = '#countercol > table > tbody'.length

// const twitterURI = `https://twitter.com/intent/retweet?tweet_id=${twitterID}&related=mediagazer`

const getStories = async (page) => {
  try {
    return await page.evaluate(() => {
      const nodelist = document.querySelectorAll('#countercol > table > tbody > tr')
      return Array.from(nodelist)
    })
  } catch (error) {
    console.error(error)
  }
}

const getLink = story => story.querySelector('td > a').getAttribute('href')
const getTwitterID = story => story.querySelector('td > .rshr').getAttribute('twid')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(URI)

  const stories = await getStories(page)

  const data = stories.map((story) => {
    return {
      link: getLink(story),
      twitterID: getTwitterID(story)
    }
  })

  console.log(data)

  browser.close()
})()
