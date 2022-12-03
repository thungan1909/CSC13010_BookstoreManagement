const db = require('./db');
const tbName = 'PhieuNhapSach';
class BookImportModel {
    async add(bookImport) {
        const res = await db.add(tbName, bookImport);
        return res;
    }
    async getByTime (month, year) {
        const condition = `WHERE EXTRACT(MONTH FROM "NgayNhap") = ${month} AND EXTRACT(YEAR FROM "NgayNhap") = ${year}`;
        const res = await db.loadCondition(tbName, 'Id', condition);
        return res;
    }
}
module.exports = new BookImportModel;