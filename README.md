# Techmeme - Hacker News crosspost bot built with Chrome Headless / Puppeteer

Scrapes TM for today's submitted stories, checks if they've already been posted on HN, posts them.

## Usage

Needs Node 7.6.0 or newer because of async/await, Node 8 recommended.

Put your HN username and password in `secrets.js`.

`node index.js --build-queue` scrapes and puts the resulting list of stories in `output/queue.json`.

`node index.js --post` takes the oldest story off the queue and posts it.

## How this would look in production

First run `--build-queue`. Then schedule `--post` to run every x number of minutes/hours, depending on your HN account rate limit. New account have very strict rate limits. `--post` is smart enough to check again if the story has been posted in the meantime (since scraping), and will run `--build-queue` automatically when needed.

You can deploy this on any server or your FAAS-provider of choice, so long as Node 7.6.0 or higher is available. Scheduling can be with CRON on the server or [Google App Engine's `cron.yaml`](https://cloud.google.com/appengine/docs/flexible/nodejs/scheduling-jobs-with-cron-yaml).

## Reasons to not put this in production

- There is really not much *overlap of interest* between the two communities. Takeaway: the reason most TM stories are not posted on HN is because the community there is not interested.
- Titles will be bad. HNs 80 char limit means even though we're smart enough to take the titles out of TMs tweet intents, they still have to be programmatically shortened, which at least in some cases, produces low-quality or even nonsensical titles


