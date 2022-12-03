const express = require('express'),
    router = express.Router(),
    customerModel = require('../models/customer.M'),
    debtPayModel = require('../models/debtPay.M');

router.get('/', async (req, res) => {
    // Chặn, không cho vào trang khi chưa đăng nhập
    if (!req.user) return res.redirect('/');
    const data = await customerModel.all();
    res.render('payment', {
        nav: () => 'navbar',
        active: { payment: true },
        payments: data
    });
});
router.post('/', async (req, res) => {
    const id = Number(req.body.id);
    let debt = Number(req.body.currentDebt.replaceAll(',','')) - Number(req.body.payInput);
    if(debt < 0){
        debt = 0;
    }
    console.log(id, debt);
    await customerModel.updateDebt(id, debt);
    

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const todayString = yyyy + '/' + mm + '/' + dd;

    const payment = {
        IdKhachHang: Number(req.body.id),
        NgayThuTien: todayString,
        SoTienThu: req.body.payInput
    };
    await debtPayModel.add(payment);
    res.redirect('/payment');
});
module.exports = router;