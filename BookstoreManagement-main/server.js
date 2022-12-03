require('dotenv').config();

const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    path = require("path");
require('./middlewares/handlebars')(app);
//session
require('./middlewares/session')(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//passport
require('./middlewares/passport')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));

app.use('/', require('./controllers/home.C'));
app.listen(port, () => console.log(`server is listening on port: ${port}`));