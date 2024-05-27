const DB = require("../../../config/database/connection").knex;

const table = "master_group";

exports.query = () => DB(table);

exports.list = async () =>
  await DB(table)
    .select("group_name", "group_description", "group_code", "group_type")
    .orderBy("group_name");

exports.count = async (object) =>
  (await DB(table).count("group_name"))[0].count;

exports.dropdown = async () =>
  await DB(table)
    .select(
      "mg.group_name",
      "mg.group_description",
      "mg.group_code",
      "gam.region_type_id"
    )
    .distinct("mg.group_code")
    .from("master_group as mg")
    .innerJoin(
      "group_activity_mapping as gam",
      "mg.group_code",
      "gam.group_code"
    )
    .orderBy("mg.group_code");

exports.locationGroupDropdown = async () => await DB(table).select("mg.group_name", "mg.group_description", "mg.group_code", "lgm.location_type")
  .distinct("mg.group_code")
  .from("master_group as mg")
  .innerJoin("location_group_mapping as lgm", "mg.group_code", "lgm.group_code").orderBy("mg.group_code");;
