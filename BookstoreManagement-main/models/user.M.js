const db = require('./db');

const tbName = 'TaiKhoan';
const idFieldName = 'TenDangNhap';
class UserModel {
    async get(username) {
        const res = await db.get(tbName, idFieldName, username);
        if (res.length > 0) return res[0];
        return null;
    }

    async patchPass(account) {
        const fieldName = ['MatKhau'];
        const username = account.TenDangNhap;
        const condition = ` WHERE "${idFieldName}" = ` + `'${username}'`;
        const res = await db.patch(tbName, fieldName, account, condition);
        return res;
    }

    set setUsername(username) {
        this.username = username;
    }

    get getUsername() {
        return this.username;
    }
}
module.exports = new UserModel;