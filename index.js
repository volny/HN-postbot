const puppeteer = require('puppeteer')
const login = require('./hnLogin').login
const getStories = require('./techmeme').getStories
const filterPosted = require('./algolia').filterPosted

// const submissionsList = [ { title: 'Microsoft was an early player in AR with HoloLens but is being overtaken by Apple and Google',
//     link: 'http://arstechn/gadgets/2017/08/microsoft-was-leading-the-world-in-ar-now-its-at-risk-of-being-left-behind/' },
//   { title: 'California DMV website shows Samsung has secured a permit to test self-driving cars',
//     link: 'http://techcrunch.com/2017/08/31/samsung-secures-self-driving-car-testing-permit-for-california-roads/' },
//   { title: 'After documenting botnet attack on ProPublica, DFR Lab faced its own attack by bots, fakes',
//     link: 'http://krebsonsecurity.com/2017/08/twitter-bots-use-likes-rts-for-intimidation/' },
//   { title: 'Crowdsourced delivery platform Deliv expands to 33 markets and 1.4K cities, has 4K partners',
//     link: 'http://tench.com/2017/08/31/same-day-delivery-startup-deliv-expands-to-1400-cities-rivalling-amazons-prime-now/' },
//    { title: 'Apple breaks silence on net neutrality, urging FCC not to roll back ban against fast lanes',
//     link: 'http://www.rcode.net/2017/8/31/16233606/apple-fcc-tim-cook-net-neutrality-trump-chairman-ajit-pai' },
//   { title: 'Instagram rolls out Stories to desktop and mobile web today, with upload feature coming soon',
//     link: 'http://www.theverge.com/2017/8/31/16233416/instagram-stories-mobile-desktop-web-support' },
//   { title: 'Apple announces iPhone event on Sept. 12 in Steve Jobs theater ',
//     link: 'http://www.loopinsight.com/2017/08/31/apple-announces-iphone-event-on-sept-12-in-steve-jobs-theater/' }
//   ]

;(async () => {
  try {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()

    // fetch the stories object from techmeme
    const submissionsList = await getStories(page)
    // check with hn API which haven't been posted and filter
    const unpostedStories = await filterPosted(submissionsList)
    console.log(unpostedStories)
    // login to hn
    // await login(page)

    // post all stories

    browser.close()
  } catch (error) {
    console.error(error)
  }
})()
