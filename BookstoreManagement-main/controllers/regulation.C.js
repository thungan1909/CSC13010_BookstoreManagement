const express = require('express'),
      router = express.Router();
const regulationModel = require('../models/regulation.M')

router.get('/', async (req, res) => {
    // Chặn, không cho vào trang khi chưa đăng nhập
    if (!req.user) return res.redirect('/');

    const list = await regulationModel.load();

    req.session.pathCur = '/regulation';
    res.render('regulation', {
        nav: () => 'navbar',
        active: { regulation: true },
        regulations: list,
        empty: list.length === 0
    })
})

router.post('/add', async(req, res) => {
    let regulation = {
        TenQuyDinh: req.body.regulationName,
        GiaTri: parseInt(req.body.regulationValue),
        KieuDuLieu: req.body.regulationKind,
        TinhTrangSuDung: (req.body.regulationUse === 'true')
    };

    // console.log(regulation)
    await regulationModel.add(regulation);
    
    res.redirect('/regulation');
});

router.post('/update/:Id', async(req, res) => {
    const id = parseInt(req.params.Id);
    let regulation = {
        Id: id,
        TenQuyDinh: req.body.regulationNameEdit,
        GiaTri: parseInt(req.body.regulationValueEdit),
        KieuDuLieu: req.body.regulationKindEdit,
        TinhTrangSuDung: (req.body.regulationUseEdit === 'true')
    };

    await regulationModel.update(regulation, id);
    
    res.redirect('/regulation');
})

router.post('/delete/:Id', async(req, res) => {
    const regulation = {
      Id: parseInt(req.params.Id)
    }
  
    await regulationModel.del(regulation);

    res.redirect('/regulation');
});

module.exports = router;