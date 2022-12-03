const db = require('./db');
const tbName = 'KhachHang';
class CustomerModel {
    async all() {
        const res = await db.load(tbName, 'Id');
        return res;
    }
    async getById (id) {
        const condition = `WHERE "Id" = ${id}`;
        const res = await db.loadCondition(tbName, 'Id', condition);
        return res;
    }
    async getByInformation (name, address, phoneNumber) {
        const condition = `WHERE "HoTen" = '${name}' and "DiaChi" = '${address}' and "DienThoai" = '${phoneNumber}'`;
        const res = await db.loadCondition(tbName, 'Id', condition);
        return res;
    }
    async add(customer) {
        const res = await db.add(tbName, customer);
        return res;
    }
    async updateDebt (id, debt) {
        let customer = {
            Id: id,
            TienNo: debt
        };
        const condition = `WHERE "Id" = ${id}`;
        const res = await db.patch(tbName, ['Id', 'TienNo'], customer, condition);
        return res;
    }
}
module.exports = new CustomerModel;