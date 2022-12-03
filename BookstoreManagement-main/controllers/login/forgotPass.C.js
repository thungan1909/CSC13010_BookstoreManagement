const express = require('express'),
      router = express.Router(),
      userM = require('../../models/user.M');
      
router.get('/', (req, res) => {
    //Khi tài khoản đăng nhập sẽ không chuyển tới trang đổi mật khẩu được.
    if (req.user) return res.redirect(req.session.pathCur);

    res.render('forgetPass1', {
        error: false
    });
});

router.post('/', async (req, res) => {
    const username = req.body.username
    const user = await userM.get(username);
    
    if(!user) {
        return res.render('forgetPass1', {
            message: 'Tài khoản không tồn tại!',
            error: true, 
        });
    }
    userM.setUsername = username;

    return res.redirect('/changePass');
})

module.exports = router;