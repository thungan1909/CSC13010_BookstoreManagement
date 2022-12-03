const express = require('express'),
      router = express.Router(),
      passport = require('passport');

router.get('/', (req, res) => {
    //Khi tài khoản đăng nhập sẽ không chuyển tới trang đăng nhập được.
    if (req.user) return res.redirect(req.session.pathCur);
    
    res.render('login', {
        error: false,
    });
});

router.post('/', async (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {   
        //Tài khoản không tồn tại trong database
        if (err)
            return res.render('login', {
                message: 'Tài khoản không tồn tại!',
                error: true,
            });

        if (info) {
            return res.render('login', {
                layout: false,
                message: info.message,
                error: true,
            });
        }

        req.logIn(user, async function (err) {
            if (err) {
                //Tài khoản không tồn tại trong database
                return res.render('login', {
                    message: 'Tài khoản không tồn tại',
                    error: true,
                });
            }
            delete user.MatKhau;

            return res.redirect('/home');
        });
    })(req, res, next);  
});

module.exports = router;