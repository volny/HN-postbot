const request = require('request-promise')
const secrets = require('./secrets.js')

const storyPostedAlready = async (story) => {
  const URI = `https://hn.algolia.com/api/v1/search?query=${story.link}&restrictSearchableAttributes=url`
  try {
    const data = await request(URI)
    const json = JSON.parse(data)
    if (json.hits) {
      console.log('Found ' + json.hits.length + ' Links')
      if (json.hits.length < 1) {
        return false
      }
    } else {
      console.log('Something went wrong with Algolia\'s API - Story omitted.')
    }
  } catch (error) {
    console.error(error)
  }
  return true
}

const filterStoryList = async (list) => {
  let filtered = []
  for (let story of list) {
    console.log('Processing:', story.title)
    try {
      const postedAlready = await storyPostedAlready(story)
      if (postedAlready === false) {
        filtered.push(story)
      }
    } catch (error) {
      console.error(error)
    }
  }
  return filtered
}

const postHasSucceeded = async (link) => {
  const URI = `https://news.ycombinator.com/submitted?id=${secrets.username}`
  try {
    const text = await request(URI)
    return text.toString().includes(link)
  } catch (error) {
    console.error(error)
  }
}

module.exports.storyPostedAlready = storyPostedAlready
module.exports.filterStoryList = filterStoryList
module.exports.postHasSucceeded = postHasSucceeded
