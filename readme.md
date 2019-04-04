# tum-calendar-sanitize

> Remove duplicates from your TUM calendar

**Problem:** Lectures that are livestreamed to a separate lecture hall appear twice in your TUM calendar  
**Solution:** Filter the duplicates and simply add the location of the second lecture hall to the original event


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
