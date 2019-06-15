# tum-calendar-sanitize

> Remove duplicates from your TUM calendar

**Problem:** Events that are held simultaneously in multiple lecture halls appear multiple times in your calendar  
**Solution:** Replace all duplicates with a single event listing all locations


## Usage

1. Create an [AWS Lambda](https://aws.amazon.com/lambda/) function named `tum-calendar-sanitize`
2. Run `make deploy-lambda`
3. Setup [API Gateway](https://aws.amazon.com/api-gateway/) to give your lambda function an HTTP endpoint
4. Fetch your calendar's url from [TUMonline](https://campus.tum.de/tumonline/wbKalender.wbPerson) (via the publish button)
5. Replace everything before the query parameters (`pStud` and `pToken`) with your function's HTTP endpoint
6. Subscribe to that url in your calendar app of choice

**Note:**
- Depending on your setup you might need to adjust the lambda function's name and AWS region in the Makefile
- You'll also need to update the route name in [`main.js`](/main.js) (the one used in the `app.get` call) to match your API Gateway resource name


## Example

Before / After

![](https://s3.amazonaws.com/lukaskollmer/embed/tum-calendar-sanitize/combined.png)


## License

MIT @ [Lukas Kollmer](https://lukaskollmer.me)
