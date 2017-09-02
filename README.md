## bugs

## Ideas

- Log. Instead of putting it in console, could generate a log, including checking what posts succeeded
- could send that log to myself via Email or Messenger
- could use Messenger to send only errors (That would be a useful exercise - *alert myself if programm needs my attention*)

## Todo

- flags: The programm takes 2 flags, `--build-queue` and `--post`. We build a `output/queue.json` file, that puts all the links in, then takes it from there.

- queue
  + Because of the "you're posting too much" limits the app in it's current form isn't ready for production. The last feature I implement before I put this to sleep (see below) is a *queue*.

- shorten titles if too long

---

# Techmeme - Hacker News crosspost robot built with Chrome Headless / Puppeteer

Scrapes TM for today's submitted stories, checks if they've already been posted on HN, posts them.

## Usage

Put your HN username and password in `secrets.js`.

`node index.js --build-queue` scrapes and puts the resulting list of stories in `output/queue.json`

`node index.js --post` takes the oldest story off the queue and posts it

## How this would look in production

Schedule `--post` to run every x number of minutes/hours, depending on your HN account rate limit. New account have very strict rate limits. If you're down to the last item in the queue, run `--build-queue` to fetch new entries. `--post` is smart enough to check again if the story has been posted in the meantime (since scraping), so don't worry that your queue is 'out of date'.

No reason to spin up a server for this, you can easily run this on Google Cloud Functions or AWS Lambda, scheduling can be done with [Google App Engine's `cron.yaml`](https://cloud.google.com/appengine/docs/flexible/nodejs/scheduling-jobs-with-cron-yaml).

## Reasons to not put this in production

- There is really not much *overlap of interest* between the two communities. Takeaway: the reason most TM stories are not posted on HN is because the community there is not interested.
- Titles will be bad. HNs 80 char limit means even though we're smart enough to take the titles out of TMs tweet intents, they still have to be programmatically shortened, which at least in some cases, produces low-quality or even nonsensical titles


