# tum-calendar-sanitize

> Remove duplicates from your TUM calendar

**Problem:** Lectures that are livestreamed to a separate lecture hall appear twice in your TUM calendar  
**Solution:** Filter the duplicates and simply add the location of the second lecture hall to the original event


## Usage

1. Fetch the url of your personal calendar in [CAMPUSonline](https://campus.tum.de/tumonline/wbKalender.wbPerson) (via the Publish button)
2. Find the `pStud` and `pToken` parameters
3. Fill them into the following url

```
https://tum-calendar-sanitize.now.sh/?pStud=STUD_PARAM&pToken=TOKEN_PARAM
```

4. Subscribe to that url in your calendar app of choice

_This is hosted on [zeit.co](https://zeit.co), but you can deploy your own instance to any serverless platform (like AWS Lambda)_

## Example

Before / After

![](https://s3.amazonaws.com/lukaskollmer/embed/tum-calendar-sanitize/combined.png)


## License

MIT © [Lukas Kollmer](https://lukaskollmer.me)
