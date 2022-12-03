const express = require('express'),
      router = express.Router();

router.get('/', (req, res, next) => {
    if(req.user) {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    }
});

module.exports = router;