const express = require("express");
const Handler = require("../../handlers/Masters/MasterSettingsHandler");
const routers = express.Router();

routers.post("/add-master-year", async (req, res) => { return await Handler.addYear(req, res) });
routers.post("/update-master-year", async (req, res) => { return await Handler.updateYear(req, res) });
routers.post("/get-mstp", async (req, res) => { return await Handler.getMSPT(req, res) });
routers.post("/update-mstp", async (req, res) => { return await Handler.updateMSPT(req, res) });
routers.post("/get-menus-system", async (req, res) => { return await Handler.getMenusList(req, res) });
routers.post("/add-update-menu", async (req, res) => { return await Handler.handleMenus(req, res) });
routers.post("/get-system-permission", async (req, res) => { return await Handler.getSystemPermission(req, res) });
routers.post("/handle-system-permission", async (req, res) => { return await Handler.handleSystemPermission(req, res) });
routers.post("/update-role-permission", async (req, res) => { return await Handler.updateRolePermission(req, res) });
routers.post("/delete-system-permission", async (req, res) => { return await Handler.deleteSystemPermission(req, res) });
routers.post("/get-notifications", async (req, res) => { return await Handler.getNotifications(req, res) });
routers.post("/handle-notifications", async (req, res) => { return await Handler.handleNotifications(req, res) });
routers.post("/sub-components-list", async (req, res) => { return await Handler.getSubComponentsList(req, res) });
routers.post("/handle-sub-component", async (req, res) => { return await Handler.handleSubComponents(req, res) });
routers.post("/activity-master-list", async (req, res) => { return await Handler.getActivitiesList(req, res) });
routers.post("/add-activity", async (req, res) => { return await Handler.addActivity(req, res) });
routers.post("/update-activity", async (req, res) => { return await Handler.updateActivity(req, res) });
routers.get("/get-max-activity-master-id", async (req, res) => { return await Handler.getMaxActivityMasterID(req, res) });
routers.get("/get-max-activity-details-id", async (req, res) => { return await Handler.getMaxActivitDetailsID(req, res) });
routers.post("/handle-sub-activity", async (req, res) => { return await Handler.handleActivityDetails(req, res) });
routers.post("/add-group",async (req, res) => { return await Handler.addGroup(req, res) });
routers.get("/get-activity-group-mapping", async (req, res) => { return await Handler.getActivityGroupMapping(req, res) });
routers.post("/get-activity-group-mapping-details", async (req, res) => { return Handler.getActivityGroupMappingDetails(req, res) });
routers.post("/handle-group-activity-mapping", async (req, res) => { return await Handler.handleGroupActivityMapping(req, res) });
routers.post("/delete-group-activity-mapping", async (req, res) => { return await Handler.deleteActivityGroupMapping(req, res) });
routers.get("/get-location-group-mapping", async (req, res) => { return await Handler.getLocationGroupMapping(req, res) });
routers.post("/get-location-group-mapping-details", async (req, res) => { return Handler.getLocationGroupMappingDetails(req, res) });
routers.post("/handle-location-group-mapping", async (req, res) => { return await Handler.handleLocationGroupMapping(req, res) });
routers.post("/delete-location-group-mapping", async (req, res) => { return await Handler.deleteLocationGroupMapping(req, res) });
routers.post("/get-reports-master", async (req, res) => { return await Handler.getReportsList(req, res) });
routers.post("/add-update-report-master", async (req, res) => { return await Handler.handleReports(req, res) });
routers.post("/get-report-permissions", async (req, res) => { return await Handler.getReportPermissions(req, res) });
routers.post("/handle-report-permissions", async (req, res) => { return await Handler.handleReportPermissions(req, res) });
routers.post("/delete-report-permission", async (req, res) => { return await Handler.deleteReportPermission(req, res) });
routers.post("/get-role-permissions", async (req, res) => { return await Handler.getRolePermissions(req, res) });

module.exports = routers;