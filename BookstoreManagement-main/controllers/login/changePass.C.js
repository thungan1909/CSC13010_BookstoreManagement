const express = require('express'),
      router = express.Router(),
      userM = require('../../models/user.M'),
      bcrypt = require('bcrypt'),
      saltRounds = parseInt(process.env.SALT_ROUND);
      
router.get('/', (req, res) => {
    //Khi tài khoản đăng nhập sẽ không chuyển tới trang đổi mật khẩu được.
    if (req.user) return res.redirect(req.session.pathCur);

    res.render('forgetPass2', {
        error: false,
        username: userM.getUsername
    });
});

router.post('/', async (req, res) => {
    // Kiểm tra mật khẩu có thuộc quy tắc đặt tên gồm:
    // - Bắt đầu bằng chữ cái.
    // - Gồm chữ cái và số.
    // - Có độ dài từ [5, 16]

    const password1 = req.body.password1;
    const password2 = req.body.password2;
    //Kiểm tra độ dài pass
    if (password1.length < 5 || password1.length > 16)
        return res.render('forgetPass2', {
            error: true,
            message: 'Độ dài của pass thuộc đoạn [5, 16]!',
            username: userM.getUsername
        });

    // Kiểm tra mật khẩu có thuộc quy tắc đặt tên
    const regexp = /^[a-z]([0-9a-z_\s])+$/i;
    if (!regexp.test(password1)) {
        return res.render('forgetPass2', {
            error: true,
            message: 'Mật khẩu bắt đầu bằng chữ cái, gồm chữ cái [a-z] và số [0-9]!',
            username: userM.getUsername
        });
    }

    //2 pass không khớp
    if (password2 !== password1) {
        return res.render('forgetPass2', {
            error: true,
            message: 'Mật khẩu mới không khớp!',
            username: userM.getUsername
        });
    }

    const pwdHashed = await bcrypt.hash(password1, saltRounds);
    let account = {
        TenDangNhap: userM.getUsername,
        MatKhau: pwdHashed,
    };

    await userM.patchPass(account);
    return res.redirect('/');
})

module.exports = router;