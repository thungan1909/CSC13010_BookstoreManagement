const db = require('./db');
const tbName = 'HoaDon';
class InvoiceModel {
    async add(invoice) {
        const res = await db.add(tbName, invoice);
        return res;
    }
    async getByTime (month, year) {
        const condition = `WHERE EXTRACT(MONTH FROM "NgayLap") = ${month} AND EXTRACT(YEAR FROM "NgayLap") = ${year}`;
        const res = await db.loadCondition(tbName, 'Id', condition);
        return res;
    }

}
module.exports = new InvoiceModel;