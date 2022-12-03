const db = require('./db');

const tbName = 'ChiTietKhuyenMai';

class PromotionDetailModel {
    async getByBookId(bookId){
        const condition = `WHERE "IdSach" = ${bookId}`;
        const res = await db.loadCondition(tbName, 'Id', condition);
        return res;
    }

    async add(bookDetail) {
        const res = await db.add(tbName, bookDetail);
        return res;
    }
}
module.exports = new PromotionDetailModel;