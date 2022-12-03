const express = require('express'),
  router = express.Router();
const bookLookUpModel = require('../models/bookLookUp.M');


router.get('/', async (req, res) => {
  // Chặn, không cho vào trang khi chưa đăng nhập
  if (!req.user) return res.redirect('/');
  const list = await bookLookUpModel.load();
  res.render('bookLookUp', {
    nav: () => 'navbar',
    active: { bookLookUp: true },
    bookLookUps: list,
    empty: list.length === 0
  })

})
router.get('/search', async (req, res) => {
  // Chặn, không cho vào trang khi chưa đăng nhập
  if (!req.user) return res.redirect('/');
  //từ khoá
  const search = req.query.search;
  const list = await bookLookUpModel.findBook(search);


  res.render('bookLookUp', {
    nav: () => 'navbar',
    active: { bookLookUp: true },
    bookLookUps: list,
    empty: list.length === 0
  });
});
module.exports = router;