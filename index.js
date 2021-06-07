require('dotenv').config()
const express = require('express');
const cors = require('cors');
const axios = require('axios').default;
const port = 3000;
const app = express();

app.use(cors());

app.get('/stops', async (req, res) => {
  if (req.query.lat === undefined || req.query.lon === undefined) {
    res.sendStatus(422);
    return;
  }
  const { lat, lon } = req.query;
  const stopURL = `https://bustime.mta.info/api/where/stops-for-location.json?version=2&key=${process.env.MTA_API_KEY}&lat=${lat}&lon=${lon}&latSpan=0.005&lonSpan=0.005`;
  const response = await axios.get(stopURL);
  if (response.status === 200) res.send(response.data);
  else res.sendStatus(500);
});

app.get('/stop/:id', async (req, res) => {
  if (req.params.id === undefined) {
    res.sendStatus(422);
    return;
  }
  const { id } = req.params;
  const stopURL = `https://bustime.mta.info/api/siri/stop-monitoring.json?version=2&key=${process.env.MTA_API_KEY}&MonitoringRef=${id}`;
  const response = await axios.get(stopURL);
  if (response.status === 200) res.send(response.data);
  else res.sendStatus(500);
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});