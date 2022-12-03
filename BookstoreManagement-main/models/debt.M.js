const db = require('./db');
const tbName = 'PhieuGhiNo';
class DebtModel {
    async add(debt) {
        const res = await db.add(tbName, debt);
        return res;
    }
    async getByTime (month, year) {
        const condition = `WHERE EXTRACT(MONTH FROM "NgayLap") = ${month} AND EXTRACT(YEAR FROM "NgayLap") = ${year}`;
        const res = await db.loadCondition(tbName, 'Id', condition);
        return res;
    }
}
module.exports = new DebtModel;