const URI = 'https://www.techmeme.com/river'

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

const getTitleFromID = async (page, twitterID) => {
  const twitterURI = `https://twitter.com/intent/retweet?tweet_id=${twitterID}&related=mediagazer`
  // techmeme has this bug where sometimes it creates no twitterlink
  // e.g. https://www.techmeme.com/170831/p11#a170831p11
  if (twitterID) {
    await page.goto(twitterURI)
    const title = await page.evaluate(() => {
      const text = document.querySelector('.tweet-text').innerHTML
      const title = text.substring(0, text.indexOf('<a') - 1)
      return title
    })
    return title
  } else {
    return ''
  }
}

const makeSubmissionList = async (page, links, twitterIDs) => {
  // not proud, but `map` doesn't `await`, and this is the most straightforward and readable way
  let titles = []
  for (let twitterID of twitterIDs) {
    try {
      const title = await getTitleFromID(page, twitterID)
      titles.push(title)
    } catch (error) {
      console.log(error)
    }
  }
  return links.map((link, i) => ({
    title: titles[i],
    link: link
  }))
}

module.exports = {
  getStories: async (page) => {
    try {
      await page.goto(URI)
      const links = await getLinks(page)
      const twitterIDs = await getTwitterIDs(page)
      const submissionsList = await makeSubmissionList(page, links, twitterIDs)
      return submissionsList
    } catch (error) {
      console.error('Error in techmeme.js', error)
    }
  }
}
