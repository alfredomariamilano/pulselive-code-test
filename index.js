// Starting express app and require player-stats.json
const express      = require('express');
const app          = express();
const port         = process.env.PORT || 8000;
const playersStats = require('./player-stats.json');

// Use public as a static folder for the users to access
app.use(express.static(`${__dirname}/public`));

// Set route behavior on GET to /players, sending the json
app.get('/players', (req, res) => res.status(200).json(playersStats));

// All other get requests will just serve the html file
app.get('/*', (req, res) =>  res.sendFile(`${__dirname}/index.html`));

// App starting on port 8000
app.listen(port, () => console.log(`Express started on port: ${port}`));
