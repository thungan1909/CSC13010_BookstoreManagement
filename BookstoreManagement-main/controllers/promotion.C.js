const express = require('express'),
      router = express.Router();
const promotionModel = require('../models/promotion.M');
const promotionDetailModel = require('../models/promotionDetail.M');
const bookModel = require('../models/book.M');
const upload = require('../middlewares/upload');

router.get('/', async(req, res) => {
    // Chặn, không cho vào trang khi chưa đăng nhập
    if (!req.user) return res.redirect('/');
    
    // Load các khuyến mãi và ưu đãi
    const limit = 2;
    const page = +req.query.page || 1;
    if(page < 0)
        page = 1;
    const offset = (page - 1)*limit;   
    const [total, list] = await Promise.all([
        promotionModel.count(),
        promotionModel.page(limit, offset)
    ]);

    const nPages = Math.ceil(total[0].Size/2);   

    const page_items = [];
    for(let i = 1; i <= nPages; i++){
        const item = {
            value: i,
            isActive: i === page
        };
        page_items.push(item);
    };

    // Hiển thị danh sách các sách
    const allBooks = await bookModel.all();

    // Load các sách được ưu đãi và khuyến mãi
    for (let index = 0; index < list.length; index++) {
        const bookId = await promotionModel.loadBookIdCondition(list[index].Id)
                
        let book = new Array();
        for (let i = 0; i < bookId.length; i++) {
            let bookTemp = await promotionModel.loadBookCondition(bookId[i].IdSach);
            bookTemp[0].STT = i + 1;
            book.push(bookTemp[0])
        }

        list[index].Book = book;
    }
    
    req.session.pathCur = '/promotion';
    res.render('promotion', {
        nav: () => 'navbar',
        active: { promotion: true },
        promotions: list,
        empty: list.length===0,
        page_items: page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        allBooks: allBooks
    });
});


router.post('/add',  upload.array('promotionImage', 12), async(req, res) => {
    let promotion = {
        LoaiKhuyenMai: parseInt(req.body.promotionName),
        LinkAnhKhuyenMai: req.files[0].originalname,
        PhanTramGiamGia: req.body.promotionPercentage
    };

    const rs = await promotionModel.add(promotion);

    console.log(rs);
    const options = req.body.options;
    // console.log(options);
    for (let i = 0; i < options.length; i++) {
        let promotionDetail = {
            IdSach: options[i],                 
            IdKhuyenMai: rs.Id
        };
        await promotionDetailModel.add(promotionDetail);
    }
    
    return res.redirect('/promotion');
});

module.exports = router;