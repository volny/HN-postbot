const puppeteer = require('puppeteer')

const URI = 'https://www.techmeme.com/river'

// // get the number of articles of the current day
// const length = '#countercol > table > tbody'.length

// const twitterURI = `https://twitter.com/intent/retweet?tweet_id=${twitterID}&related=mediagazer`

// I dislike that I have to traverse the DOM twice to get my links/twitter ids
// the 'correct' way of doing this would be to `getStories`, an array of DOM nodes, and then get whatever out of that
// trouble is chrome gives me an array of 'elementHandles' that have no (documented) way to access it's children
// see commit 'error - why do we get empty responses' for the approach I took

const getLinks = async (page) => {
  const links = await page.evaluate(() => {
    const tbodies = document.querySelectorAll('#countercol > table > tbody')
    const today = [...tbodies[0].querySelectorAll('.ritem > td > a')]
    return today.map((story) => story.getAttribute('href'))
  })
  return links
}

const getTwitterIDs = async (page) => {
  const twitterIDs = await page.evaluate(() => {
    const tbodies = document.querySelectorAll('#countercol > table > tbody')
    const today = [...tbodies[0].querySelectorAll('.ritem > td > .rshr')]
    return today.map((story) => story.getAttribute('twid'))
  })
  return twitterIDs
}

const makeObject = (links, twitterIDs) => (
  links.map((link, i) => ({
    link: link,
    twitterID: twitterIDs[i]
  }))
)

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(URI)

  const links = await getLinks(page)
  const twitterIDs = await getTwitterIDs(page)

  const linksWithIDs = makeObject(links, twitterIDs)

  console.log(linksWithIDs)

  browser.close()
})()
