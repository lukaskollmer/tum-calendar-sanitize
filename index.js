const url = require('url');
const fetch = require('node-fetch');
const icalendar = require('icalendar');


const handleData = data => {
  const cal = icalendar.parse_calendar(data);

  // lil' helper function to get a property value from an event
  const getProperty = (e, k) => e.getPropertyValue(k);



  const equals = (event1, event2) => {
    // Comparing two events is a bit annoying since we can't just loop through the keys we want to compare
    // The problem is that you can't compare two Dates with the === operator

    // Check if the titles are equal
    const titleEquals = getProperty(event1, 'SUMMARY') === getProperty(event2, 'SUMMARY');
    if (!titleEquals) {
      return false;
    }

    // Check if the start and end dates are equal
    const dateFields = ['DTSTART', 'DTEND'];
    for (var i = 0; i < dateFields.length; i++) {
      const dateField = dateFields[i];
      if (getProperty(event1, dateField).getTime() !== getProperty(event2, dateField).getTime()) {
        return false;
      }
    }

    // We're only here if everything we compared was equal between the two events
    return true;
  }

  // sort all events by start date
  const events = cal.events().sort((e1, e2) => getProperty(e1, 'DTSTART') - getProperty(e2, 'DTSTART'));

  // Array containing the indexes of all objects that are duplicates.
  // This is used for two reasons:
  // 1. to skip items we already identified as duplicates
  // 2. to delete all duplicates from the list of items
  let indexesToRemove = [];

  events.forEach((event, index, events) => {
    // Skip this for events we already identified as duplicates
    if (indexesToRemove.includes(index)) { return; }

    const nextEvent = events[index + 1];


    // add fields from event2 to event1
    // This will be formatted: `${shorter_field} && ${longer_field}`
    const combineEvents = (event1, event2, fields) => {
      fields.forEach(field => {
        const value1 = getProperty(event1, field);
        const value2 = getProperty(event2, field);

        if (value1.length < value2.length) {
          event1.setProperty(field, `${value1} && ${value2}`);
        } else {
          event1.setProperty(field, `${value2} && ${value1}`);
        }
      });
    };

    if (nextEvent !== undefined) {
      if (equals(event, nextEvent)) {
        // register the index of the next event so that we can skip it
        indexesToRemove.push(index + 1);

        // add the LOCATION and DESCRIPTION fields from the second event
        // (this is important to retain information like the secondary lecture hall)
        combineEvents(event, nextEvent, ['LOCATION', 'DESCRIPTION']);
      }
    }
  });

  // Remove the items we identified as duplicates
  // We need to reverse the array of indexes first to avoid removing the wrong items
  indexesToRemove.reverse().forEach(i => events.splice(i, 1));

  cal.components['VEVENT'] = events;

  return cal.toString();
};


require('http').createServer((req, res) => {
  const query = url.parse(req.url, true).query;

  const tumOnlineUrl = `https://campus.tum.de/tumonlinej/ws/termin/ical?pStud=${query.pStud}&pToken=${query.pToken}`;

  fetch(tumOnlineUrl)
    .then(r => r.text())
    .then(data => {
      let newCalData = handleData(data);
      res.end(newCalData);
    })
    .catch(err => {
      console.log(`something went wrong :(`, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });

}).listen(process.env.PORT);
