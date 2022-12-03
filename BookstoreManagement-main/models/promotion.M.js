const db = require('./db');

const tbName = 'KhuyenMai';
const idFieldName = 'Id';
const fieldName = ['LoaiKhuyenMai', 'LinkAnhKhuyenMai'];

class PromotionModel {
    async page(limit, offset) {
        const res = await db.loadPageofPromotion(tbName, limit, offset);
        return res;
    }

    async all() {
        const res = await db.load(tbName, idFieldName);
        return res;
    }

    async MaxId() {
        const res = await db.IdMax(tbName, idFieldName);
        return res[0];
    }

    async count() {
        const condition = "";
        const res = await db.count(tbName, idFieldName, condition);
        return res;
    }

    async add(promotion) {
        const res = await db.add(tbName, promotion);
        return res;
    }
    async getById(id){
        const condition = `WHERE "Id" = ${id}`;
        const res = await db.loadCondition(tbName, 'Id', condition);
        return res;
    }
    async loadBookIdCondition(id) {
        const condition = `WHERE "IdKhuyenMai" = ${id}`;
        const res = await db.loadCondition('ChiTietKhuyenMai', idFieldName, condition)
        return res;
    }

    async loadBookCondition(id) {
        const condition = `WHERE "Id" = ${id}`;
        const res = await db.loadCondition('Sach', idFieldName, condition);
        return res;
    }
}
module.exports = new PromotionModel;