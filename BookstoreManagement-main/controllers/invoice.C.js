const express = require('express'),
    router = express.Router(),
    customerModel = require('../models/customer.M'),
    bookModel = require('../models/book.M'),
    invoiceModel = require('../models/invoice.M'),
    invoiceDetailModel = require('../models/invoiceDetail.M'),
    debtModel = require('../models/debt.M'),
    debtPayModel = require('../models/debtPay.M'),
    promotionModel = require('../models/promotion.M'),
    promotionDetailModel = require('../models/promotionDetail.M'),
    regulationModel = require('../models/regulation.M');
router.get('/', async (req, res) => {
    // Chặn, không cho vào trang khi chưa đăng nhập
    if (!req.user) return res.redirect('/');
    let minAfterSelling = 0;
    const regulations = await regulationModel.all();
    let minAfterSellingRegulation = null;

    for (let i = 0; i < regulations.length; i++) {
        if (regulations[i].TenQuyDinh === 'Lượng tồn tối thiểu sau khi bán') {
            minAfterSellingRegulation = regulations[i];
            break;
        }
    }
    if (minAfterSellingRegulation !== null) {
        if (minAfterSellingRegulation.TinhTrangSuDung) {
            minAfterSelling = Number(minAfterSellingRegulation.GiaTri);
        }
    }
    let books = await bookModel.all();
    books = books.map((book, index) => {
        book.Index = index;
        return book;
    });
    books = await Promise.all(books.map(async (book) => {
        const promotionDetail = (await promotionDetailModel.getByBookId(book.Id));
        if (promotionDetail.length === 0) {
            return {
                ...book,
                PhanTramGiamGia: 0
            }
        }
        let discount = 0;
        for (let i = 0; i < promotionDetail.length; i++) {
            const promotion = (await promotionModel.getById(promotionDetail[i].IdKhuyenMai))[0];
            if (promotion.PhanTramGiamGia > discount) {
                discount = promotion.PhanTramGiamGia;
            }
        }
        return {
            ...book,
            PhanTramGiamGia: discount
        }
    }));
    res.render('invoice', {
        nav: () => 'navbar',
        books: books,
        maxIndex: books.length,
        minAfterSelling: minAfterSelling,
        active: { invoice: true }
    });
});
async function addToInvoiceDebt(req) {
    const customerName = req.body.customerName;
    const customerAddress = req.body.customerAddress;
    const customerPhoneNumber = req.body.customerPhoneNumber;
    const customerEmail = req.body.customerEmail;
    const bookAmount = Number(req.body.currentAmount);
    const customerInDB = await customerModel.getByInformation(customerName, customerAddress, customerPhoneNumber);
    let customerId = 0;
    if (customerInDB.length) {
        customerId = customerInDB[0].Id;
    }
    else {
        const customer = {
            HoTen: customerName,
            DienThoai: customerPhoneNumber,
            DiaChi: customerAddress,
            Email: customerEmail,
            TienNo: 0
        };
        customerId = (await customerModel.add(customer)).Id;
    }
    //check max debt
    const regulations = await regulationModel.all();
    let maxDebtRegulation = null;
    let maxDebt = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < regulations.length; i++) {
        if (regulations[i].TenQuyDinh === 'Số nợ tối đa') {
            maxDebtRegulation = regulations[i];
            break;
        }
    }
    if (maxDebtRegulation !== null) {
        if (maxDebtRegulation.TinhTrangSuDung) {
            maxDebt = Number(maxDebtRegulation.GiaTri);
        }
    }
    const customerDebt = (await customerModel.getById(customerId))[0].TienNo;
    if (customerDebt + Number(req.body.sumPrice) > maxDebt) {
        return -1;
    }
    await customerModel.updateDebt(customerId, customerDebt + Number(req.body.sumPrice));
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const todayString = yyyy + '/' + mm + '/' + dd;

    const invoice = {
        IdKhachHang: customerId,
        NgayLap: todayString
    };
    console.log(invoice);
    const invoiceInDB = await invoiceModel.add(invoice);
    const invoiceId = invoiceInDB.Id;
    invoiceDetails = [];
    for (let i = 0; i < bookAmount; i++) {
        const invoiceDetail = {
            IdHoaDon: invoiceId,
            IdSach: Number(req.body["id" + i]),
            SoLuong: Number(req.body["amount" + i])
        };
        invoiceDetails.push(invoiceDetail);
    }
    for (let i = 0; i < invoiceDetails.length; i++) {
        await invoiceDetailModel.add(invoiceDetails[i]);
        const bookInDB = await bookModel.getById(invoiceDetails[i].IdSach);
        await bookModel.updateRest(bookInDB[0].Id, bookInDB[0].LuongTon - invoiceDetails[i].SoLuong);
    }
    return customerId;
}
async function addToInvoice(req) {
    const customerName = req.body.customerName;
    const customerAddress = req.body.customerAddress;
    const customerPhoneNumber = req.body.customerPhoneNumber;
    const customerEmail = req.body.customerEmail;
    const bookAmount = Number(req.body.currentAmount);
    const customerInDB = await customerModel.getByInformation(customerName, customerAddress, customerPhoneNumber);
    let customerId = 0;
    if (customerInDB.length) {
        customerId = customerInDB[0].Id;
    }
    else {
        const customer = {
            HoTen: customerName,
            DienThoai: customerPhoneNumber,
            DiaChi: customerAddress,
            Email: customerEmail,
            TienNo: 0
        };
        customerId = (await customerModel.add(customer)).Id;
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const todayString = yyyy + '/' + mm + '/' + dd;

    const invoice = {
        IdKhachHang: customerId,
        NgayLap: todayString
    };
    console.log(invoice);
    const invoiceInDB = await invoiceModel.add(invoice);
    const invoiceId = invoiceInDB.Id;
    invoiceDetails = [];
    for (let i = 0; i < bookAmount; i++) {
        const invoiceDetail = {
            IdHoaDon: invoiceId,
            IdSach: Number(req.body["id" + i]),
            SoLuong: Number(req.body["amount" + i])
        };
        invoiceDetails.push(invoiceDetail);
    }
    for (let i = 0; i < invoiceDetails.length; i++) {
        await invoiceDetailModel.add(invoiceDetails[i]);
        const bookInDB = await bookModel.getById(invoiceDetails[i].IdSach);
        await bookModel.updateRest(bookInDB[0].Id, bookInDB[0].LuongTon - invoiceDetails[i].SoLuong);
    }
    return customerId;
}
router.post('/debt', async (req, res) => {
    const customerId = await addToInvoiceDebt(req);
    if (customerId === -1) {
        return res.render('invoice', {
            nav: () => 'navbar',
            active: { invoice: true },
            failedAlert: "Ghi nợ thất bại, do số nợ của khách hàng đã vượt mức cho phép!",
            minAfterSelling: 0
        });
    }
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const todayString = yyyy + '/' + mm + '/' + dd;
    const debt = {
        IdKhachHang: customerId,
        NgayLap: todayString,
        SoTienNo: Number(req.body.sumPrice)
    };
    console.log(debt);
    await debtModel.add(debt);
    res.render('invoice', {
        nav: () => 'navbar',
        active: { invoice: true },
        alert: "Ghi nợ thành công!",
        minAfterSelling: 0
    });
});
router.post('/pay', async (req, res) => {
    const customerId = await addToInvoice(req);
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const todayString = yyyy + '/' + mm + '/' + dd;
    const payment = {
        IdKhachHang: customerId,
        NgayThuTien: todayString,
        SoTienThu: Number(req.body.sumPrice)
    };
    await debtPayModel.add(payment);
    res.render('invoice', {
        nav: () => 'navbar',
        active: { invoice: true },
        alert: "Thanh toán thành công!",
        minAfterSelling: 0
    });
});
module.exports = router;