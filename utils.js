const request = require('request-promise')

const { postStory } = require('./post')
const secrets = require('./secrets.js')

const storyPostedAlready = async (story) => {
  const URI = `https://hn.algolia.com/api/v1/search?query=${story.link}&restrictSearchableAttributes=url`
  if (story) {
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

const writeNewQueue = async (queue) => {
  try {
    // fs-extra returns a promise :)
    await fs.writeFile('./output/queue.json', JSON.stringify(queue))
  } catch (error) {
    console.error(error)
  }
}

const takeOffCue = async (queue) => {
  // TODO if the queue is empty make a new one!
  const story = queue[queue.length - 1]
  const newQueue = queue.slice(0, queue.length - 1)
  return [newQueue, story]
}

const postIfNew = async (queue, story) => {
  if (!storyPostedAlready(story)) {
    await postStory(story)
    return queue
  }

  // already posted - try next story in the queue
  const [newQueue, newStory] = await takeOffCue(queue)
  await postIfNew(newQueue, newStory)
}

module.exports.storyPostedAlready = storyPostedAlready
module.exports.filterStoryList = filterStoryList
module.exports.postHasSucceeded = postHasSucceeded
module.exports.writeNewQueue = writeNewQueue
module.exports.takeOffCue = takeOffCue
module.exports.postIfNew = postIfNew
