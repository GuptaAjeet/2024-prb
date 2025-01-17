const DB    = require('../../../config/database/connection').knex;

const table             = 'master_status';

exports.query           = () => DB(table);

exports.all             = async (request) => await DB(table).select().orderBy('status_name').limit(request.limit).offset(request.limit*(request.page-1));

exports.list            = async () => await DB(table).select('id','status_name as name').orderBy('status_name');

exports.find            = async object => await DB(table).where(object).select();

exports.update          = async (object,id) => await DB(table).where('id',id).update(object);

exports.create          = async object => await DB(table).insert(object);

exports.findOne         = async object => (await DB(table).where(object).select())[0];

exports.delete          = async object => await DB(table).where(object).delete();

exports.count           = async object => ((await DB(table).count('id'))[0]).count;

exports.detailedList    = async () => await DB(table).select("id", "status_name", "status").orderBy("id");