const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('./tools/logger');

const app = express();

//Middlewares
app.use(logger);
app.use(express.static(__dirname + '/public'));

//Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(process.env.PORT || 9999, () => {
  console.log(`Game is running on port ${process.env.PORT || 9999}`)
});
