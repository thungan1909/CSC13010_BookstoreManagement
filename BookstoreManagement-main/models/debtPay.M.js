const db = require('./db');
const tbName = 'PhieuThuTien';
class DebtPayModel {
    async add(debtPay) {
        const res = await db.add(tbName, debtPay);
        return res;
    }
    async all() {
        const res = await db.load(tbName, 'Id');
        return res;
    }
}
module.exports = new DebtPayModel;