const DB = require("../../../config/database/connection");

const table = "master_hostel";

exports.knx = () => DB;

exports.query = () => DB(table);

exports.all = async (request) =>
  await DB(table)
    .select()
    .orderBy("gender_name")
    .limit(request.limit)
    .offset(request.limit * (request.page - 1));

exports.list = async () =>
  await DB(table).select("id", "gender_name as name").orderBy("gender_name");

exports.find = async (object) => await DB(table).where(object).select();

exports.update = async (object, id) =>
  await DB(table).where("id", id).update(object).returning("*");

exports.create = async (object) =>
  await DB(table).insert(object).returning("*");

exports.findOne = async (object) => await DB(table).where(object).select();

exports.delete = async (object) => await DB(table).where(object).delete();

exports.count = async (object) => (await DB(table).count("id"))[0].count;

exports.host_sch_rel_create = async (object) =>
  await DB("master_hostel_school_rel").insert(object);
exports.host_sch_rel_delete = async (ids) =>
  await DB("master_hostel_school_rel").whereNotIn("hostel_id", ids).delete();
// .where(object).delete();
