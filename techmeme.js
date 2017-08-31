const puppeteer = require('puppeteer')

const URI = 'https://www.techmeme.com/river'


// // get the number of articles of the current day
// const length = '#countercol > table > tbody'.length

// //loop over table-rows to get individual aricles
// const selector = `#countercol > table > tbody > tr:nth-child(${iterator + 1})`
// 
// const twitterURI = `https://twitter.com/intent/retweet?tweet_id=${twitterID}&related=mediagazer`


const getTitle = async (page, iterator) => {
  try {
    return await page.evaluate((iterator) => {
      // TODO don't fetch everything each story - iterator of what you've fetched once
      const allTheStories = document.querySelectorAll('#countercol > table > tbody > tr')
      const story = allTheStories[iterator]
      const link = story.querySelector('td > a').getAttribute('href')
      return link
    }, iterator)
  } catch (error) {
    console.error(error)
  }
}

const getTwitterID = async (page, iterator) => {
  try {
    return await page.evaluate((iterator) => {
      //return document.querySelector(`#s${iterator.toString()}`).getAttribute('twid')
      return document.querySelectorAll('.rshr')[iterator].getAttribute('twid')
      //return element ? element.getAttribute('twid') : null
    }, iterator)
  } catch (error) {
    console.error(error)
  }
}

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(URI)

  const storyTitle = await getTitle(page, 0)
  console.log(storyTitle)

  //const twitterID = await getTwitterID(page, 0)
  //console.log(twitterID)

  browser.close()
})()
