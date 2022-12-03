const db = require('./db');

const idFieldName = 'Id';

class mainPageModel {
    async count(tbName) {
        const condition = "";
        const res = await db.count(tbName, idFieldName, condition);
        return res;
    }

    async countCondition(tbName, field) {
        const condition = "";
        const res = await db.count(tbName, field, condition);
        return res;
    }

    async getPrice(sachId) {
        const condition = "";
        const res = await db.get('Sach', idFieldName , sachId);
        return res;
    }

    async load(tbName) {
        const res = await db.load(tbName, idFieldName);
        return res;
    }
}

module.exports = new mainPageModel;