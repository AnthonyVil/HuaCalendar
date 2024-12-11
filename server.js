const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Save event to server
app.post('/event', (req, res) => {
    const events = JSON.parse(fs.readFileSync('events.json', 'utf8') || '[]');
    events.push(req.body);
    fs.writeFileSync('events.json', JSON.stringify(events));
    res.send('Event saved!');
});

// Export events as CSV
app.get('/export', (req, res) => {
    const events = JSON.parse(fs.readFileSync('events.json', 'utf8') || '[]');
    const csv = events.map(event => `${event.title},${event.description},${event.date},${event.time}`).join('\n');
    fs.writeFileSync('export_events.csv', csv);
    res.download('export_events.csv');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
