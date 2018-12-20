const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./routes.js');
const path = require('path');
const json2xls = require('json2xls');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/views')));
app.use(json2xls.middleware);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.use('/', routes);

app.listen(3000, () => {
  console.log('Server is up on port 3000')
});
