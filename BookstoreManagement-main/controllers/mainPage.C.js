const express = require('express'),
      router = express.Router();
const mainPageModel = require('../models/mainPage.M');

router.get('/', async (req, res) => {
    // Chặn, không cho vào trang khi chưa đăng nhập
    if (!req.user) return res.redirect('/');

    // Tính số lượng khách mua sách của cửa hàng
    const customer = await mainPageModel.count('KhachHang');
    
    // Tính tổng tiền của hóa đơn
    const detail = await mainPageModel.load('ChiTietHoaDon');
    let revenue = 0;
    for (let index = 0; index < detail.length; index++) {
        let book = await mainPageModel.getPrice(detail[index].IdSach);
        revenue += parseInt(book[0].DonGia) * detail[index].SoLuong;       
    }

    // Tính doanh thu thực tế thu được từ phiếu thu tiền
    const getMoney = await mainPageModel.load('PhieuThuTien');
    let realRevenue = 0;
    for (let index = 0; index < getMoney.length; index++) {
        realRevenue += getMoney[index].SoTienThu;
    }
    
    // Tính số khách hàng đang nợ
    const debt = await mainPageModel.count('PhieuGhiNo');

    // Tính số sách
    const book = await mainPageModel.count('Sach');
    const bookKind = await mainPageModel.countCondition('Sach', 'TheLoai');

    // Biểu đồ
    datas = [book[0].Size, bookKind[0].Size, debt[0].Size];
    datas = '[' + datas.toString() + ']';

    req.session.pathCur = '/home';
    res.render('home', {
        nav: () => 'navbar',
        active: { home: true },
        customer: customer[0].Size,
        revenue: revenue,
        realRevenue: realRevenue,
        label: '["Số lượng sách", "Số lượng thể loại", "Số khách hàng đang nợ"]',
        data: datas,
        User: req.user.TenDangNhap
    })
})

module.exports = router;