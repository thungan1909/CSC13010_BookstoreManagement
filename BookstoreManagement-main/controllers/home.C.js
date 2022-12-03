const express = require('express'),
      router = express.Router();

router.get('/', (req, res) => {
    res.redirect('login');
});

router.use('/login', require('./login/login.C'));
router.use('/forgotPass', require('./login/forgotPass.C'));
router.use('/changePass', require('./login/changePass.C'));

router.use('/home', require('./mainPage.C'));

router.use('/bookLookUp', require('./bookLookUp.C'));

router.use('/regulation', require('./regulation.C'));
router.use('/payment', require('./payment.C'));
router.use('/bookImport', require('./bookImport.C'));
router.use('/report', require('./report.C'));
router.use('/invoice', require('./invoice.C'));
router.use('/promotion', require('./promotion.C'));
router.use('/signout', require('./signout.C'));

module.exports = router;