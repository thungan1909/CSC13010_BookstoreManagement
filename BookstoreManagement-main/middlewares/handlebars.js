const exphds = require('express-handlebars');
const numeral = require('numeral');

module.exports = app => {
  const hbs = exphds.create({
    defaultLayout: false,
    extname: 'hbs' ,
    helpers: {
      ifStr(s1, s2, options) {
        if (s1 === s2) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      ifNotStr(s1, s2, options) {
        if (s1 !== s2) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      format_number: function(value){
        return numeral(parseInt(value)).format('0,0');
      },
      dateFormat: require('handlebars-dateformat')
    },

  });
  app.engine('hbs', hbs.engine);
  app.set('view engine', 'hbs');
  app.set('views', './views');
}