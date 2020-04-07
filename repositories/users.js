const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);
const Repository = require('./repository');
class UsersRepository extends Repository {
	async create(attrs) {
		const records = await this.getAll();

		attrs.id = this.randomId();
		const salt = crypto.randomBytes(8).toString('hex');
		const buff = await scrypt(attrs.password, salt, 64);
		const record = { ...attrs, password: `${buff.toString('hex')}.${salt}` };
		records.push(record);

		await this.writeAll(records);

		return record;
	}
	async comparePasswords(saved, supplied) {
		const [ hashed, salt ] = saved.split('.');
		const hashSuppliedBuff = await scrypt(supplied, salt, 64);
		return hashed === hashSuppliedBuff.toString('hex');
	}
}

module.exports = new UsersRepository('users.json');
