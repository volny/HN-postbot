const request = require('request-promise')
const secrets = require('./secrets.js')

const URI = `https://news.ycombinator.com/submitted?id=${secrets.username}`

module.exports = {
  postHasSucceeded: async (link) => {
    try {
      const text = await request(URI)
      return text.toString().includes(link)
    } catch (error) {
      console.error(error)
    }
  }
}
