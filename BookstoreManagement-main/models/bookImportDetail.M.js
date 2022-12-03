const db = require('./db');
const tbName = 'ChiTietPhieuNhap';
class BookImportDetailModel {
    async add(bookImportDetail) {
        const res = await db.add(tbName, bookImportDetail);
        return res;
    }
    async getById (id) {
        const condition = `WHERE "Id" = ${id}`;
        const res = await db.loadCondition(tbName, 'Id', condition);
        return res;
    }
}
module.exports = new BookImportDetailModel;