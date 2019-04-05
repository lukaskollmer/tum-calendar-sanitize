# tum-calendar-sanitize

> Remove duplicates from your TUM calendar

**Problem:** Events that are held simultaneously in multiple lecture halls appear multiple times in your calendar
**Solution:** Replace all duplicates with a single event listing all locations


## Usage

1. Create a [Google Cloud Function](https://cloud.google.com/functions/), using the implementation in [`main.js`](/main.js)
2. Fetch your calendar's url from [TUMonline](https://campus.tum.de/tumonline/wbKalender.wbPerson) (via the publish button)
3. Replace everything before the query parameters (`pStud` and `pToken`) with your cloud function's endpoint
4. Subscribe to that url in your calendar app of choice


## Example

Before / After

![](https://s3.amazonaws.com/lukaskollmer/embed/tum-calendar-sanitize/combined.png)


## License

MIT @ [Lukas Kollmer](https://lukaskollmer.me)
