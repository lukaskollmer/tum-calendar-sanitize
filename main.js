const IS_GOOGLE_CLOUD_FUNCTION = true;
const TUM_ONLINE_CAL_API_ENDPOINT = 'https://campus.tum.de/tumonlinej/ws/termin/ical';

const https = require('https');
const icalendar = require('icalendar');


const request = async (url) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        https.get(url, res => {
            res.on('data', data => chunks.push(data));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        });
    });
};


const getProperty = (e, k) => e.getPropertyValue(k);

const getName = e => getProperty(e, 'SUMMARY');
const getStartDate = e => getProperty(e, 'DTSTART');
const getEndDate = e => getProperty(e, 'DTEND');
const getLocation = e => getProperty(e, 'LOCATION');


const filterDuplicates = data => {
    const cal = icalendar.parse_calendar(data);
    const events = cal.events().sort((e1, e2) => getProperty(e1, 'DTSTART') - getProperty(e2, 'DTSTART'));

    const filtered = [];

    for (let i = 0; i < events.length; i++) {
        const e = events[i];
        const name  = getName(e);
        const start = getStartDate(e).getTime();
        const end   = getEndDate(e).getTime();

        const duplicates = [];

        while (i < events.length - 1) {
            const e2 = events[i + 1];
            if (name !== getName(e2) || start !== getStartDate(e2).getTime() || end !== getEndDate(e2).getTime()) break;
            duplicates.push(e2);
            i += 1;
        }

        if (duplicates.length > 0) {
            const loc = duplicates.map(getLocation).concat(getLocation(e)).join('\n- ');
            const desc = getProperty(e, 'DESCRIPTION') + '\n\nLocations: \n- ' + loc;
            e.setProperty('LOCATION', null);
            e.setProperty('DESCRIPTION', desc);
        }
        filtered.push(e);
    }

    cal.components['VEVENT'] = filtered;
    return cal.toString();
};

const main = async (req, res) => {
    const {pStud, pToken} = req.query;
    if (!pStud || !pToken) {
        res.status(400).end('pStud or pToken missing!');
        return;
    }

    const url = `${TUM_ONLINE_CAL_API_ENDPOINT}?pStud=${pStud}&pToken=${pToken}`;
    const buf = await request(url);
    const cal = filterDuplicates(buf.toString());

    res.status(200);
    res.setHeader('Content-Type', 'text/calendar; charset=UTF-8');
    res.end(cal);
};




if (IS_GOOGLE_CLOUD_FUNCTION) {
    exports.main = main;
} else {
    const express = require('express');
    const app = express();
    const port = 5000;

    app.get('/', main);
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}