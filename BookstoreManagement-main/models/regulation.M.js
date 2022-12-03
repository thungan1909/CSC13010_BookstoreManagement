const db = require('./db');

const tbName = 'QuyDinh';
const idFieldName = 'Id';
const fieldName = ['TenQuyDinh', 'GiaTri', 'KieuDuLieu', 'TinhTrangSuDung'];

class RegulationModel {
    async load() {
        const res = await db.load(tbName, idFieldName);
        return res;
    }

    async MaxId() {
        const res = await db.IdMax(tbName, idFieldName);
        return res[0];
    }

    async add(regulation) {
        const res = await db.add(tbName, regulation);
        return res;
    }

    async del(regulation) {
        const ReguId = regulation.Id;
        const condition = `WHERE "Id" = ${ReguId}`;
        const res = await db.del(tbName, condition);
        return res;
    }

    async update(regulation, id){
        const condition = ` WHERE "Id" = ${id} `;
        const res = await db.patch(tbName, fieldName, regulation, condition);
        return res;
    }
    async all() {
        const res = await db.load(tbName, 'Id');
        return res;
    }
}
module.exports = new RegulationModel;