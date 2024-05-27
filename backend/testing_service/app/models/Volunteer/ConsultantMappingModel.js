const DB    = require('../../../config/database/connection').knex;

const table     = 'consultant_mapping as cm';

exports.query   = () => DB(table);

exports.all     = async object => await DB(table).select().limit(object.limit);

exports.list    = async () => await DB(table).select('id','name');

exports.find    = async object => await DB(table).where(object).select();

exports.update  = async (object,id) => await DB(table).where('id',id).update(object);

exports.create  = async object => await DB(table).insert(object);

exports.findOne = async object => (await DB(table).where(object).select())[0];

exports.count   = async object => ((await DB(table).where(object).count('id'))[0]).count;

exports.delete  = async object => await DB(table).where(object).delete();

