const session = require('express-session');

module.exports = app => {
    app.use(
      session({
        secret: "web",
        resave: false,
        saveUninitialized: true,
      })
    );
};