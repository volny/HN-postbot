const request = require('request-promise')
const secrets = require('./secrets.js')

module.exports = {
  filterPosted: async (list) => {
    try {
      // if you're ever too bored you can try to use filter() with async like so:
      // http://thecodebarbarian.com/basic-functional-programming-with-async-await.html
      let filtered = []
      for (let story of list) {
        console.log('Processing:', story.title)
        const link = story.link
        const URI = `https://hn.algolia.com/api/v1/search?query=${link}&restrictSearchableAttributes=url`
        try {
          const data = await request(URI)
          const json = JSON.parse(data)
          if (json.hits) {
            console.log('Found ' + json.hits.length + ' Links')
            if (json.hits.length < 1) {
              filtered.push(story)
            }
          } else {
            console.log('Something went wrong with Algolia\'s API - Story omitted.')
          }
        } catch (error) {
          console.log(`Couldn't fetch ${link} - omitting`)
        }
      }
      return filtered
    } catch (error) {
      console.error('Error in algolia.js', error)
    }
  },
  postHasSucceeded: async (link) => {
    const URI = `https://news.ycombinator.com/submitted?id=${secrets.username}`
    try {
      const text = await request(URI)
      return text.toString().includes(link)
    } catch (error) {
      console.error(error)
    }
  }

}
