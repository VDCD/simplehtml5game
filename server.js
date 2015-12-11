var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('./tools/logger');

var app = express();

//Middlewares
app.use(logger);
app.use(express.static(__dirname + '/public'));

//Routes
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(process.env.PORT || 3000, function(){
  if(process.env.PORT){
    console.log('API is running on port 3000 or '+process.env.PORT);
  }else{
    console.log('API is running on port 3000');
  }
});
