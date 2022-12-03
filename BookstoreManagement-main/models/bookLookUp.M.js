const db = require('./db');
const tbName = 'Sach';
const idFieldName = 'Id';
class BookLookUpModel {

    async load() {
        const res = await db.load(tbName, idFieldName);
        return res;
    }
    
    async findBook (search) {
        const condition = `WHERE "TenSach" ILIKE '%${search}%' OR  "TacGia" ILIKE '%${search}%' OR "TheLoai" ILIKE '%${search}%'`;
        const res = await db.loadCondition(tbName, 'Id', condition);
        return res;
    }
}
module.exports = new BookLookUpModel;