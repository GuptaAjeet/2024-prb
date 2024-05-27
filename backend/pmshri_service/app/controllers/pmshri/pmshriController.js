const express = require("express");
const routers = express.Router();
const Handler = require("../../handlers").pmshri;
const multer = require("multer")

// SIDEBAR ROUTE

routers.post("/component-sidebar", async (req, res) => {
  return await Handler.componentsidebar(req, res);
});

//COMMON API'S LIKE STATE / DISTRICTS / SCHOOLS / ACTIVITY     START

routers.get("/state-list", async (req, res) => {
  return await Handler.stateList(req, res);
});
routers.post("/districts-list", async (req, res) => {
  return await Handler.districtList(req, res);
});

routers.post("/school-list", async (req, res) => {
  return await Handler.schoolList(req, res);
});

// get activities 

routers.post("/get-major-component", async (req, res) => {
  return await Handler.getMajorComponent(req, res);
});
routers.post("/get-sub-component", async (req, res) => {
  return await Handler.getSubcomponent(req, res);
});
routers.post("/get-activity", async (req, res) => {
  return await Handler.getActivities(req, res);
});
routers.post("/get-activity-detail", async (req, res) => {
  return await Handler.getActivityDetail(req, res);
});


//COMMON API'S LIKE STATE / DISTRICTS / SCHOOLS // END //

// CONFIGURATION PLAN ROUTES 

routers.post("/configure-activity-list", async (req, res) => {
  return await Handler.planActivityList(req, res);
});
routers.post("/configure-by-activity-list", async (req, res) => {
  return await Handler.configurePlanByActivity(req, res);
});

routers.post("/update-configure-activity-list", async (req, res) => {
  return await Handler.updateconfigureList(req, res);
});

routers.post("/update-configured-approve-plan", async (req, res) => {
  return await Handler.updateconfiguredApprovePlan(req, res);
});

routers.post("/approve-configuration-list", async (req, res) => {
  return await Handler.approveConfigurationList(req, res);
});

routers.post("/configured-recommendation-activity-list", async (req, res) => {
  return await Handler.getRecommandationList(req, res);
});

routers.post("/submit-approved-recommendation-planpmsri", async (req, res) => {
  return await Handler.submitApprovedPlanPmshri(req, res);
});

// ALLOCATION 

routers.post("/allocation-list", async (req, res) => {
  return await Handler.allocationList(req, res);
});
const storagesingle = multer.memoryStorage();
const uploadsingle = multer({ storage: storagesingle });
routers.post("/state-temp-allocate-fund-uploaded-detail", uploadsingle.single("file"), async (req, res) => { return await Handler.submitTempAllocationList(req, res) });

routers.post("/state-allocate-fund-uploaded-detail", async (req, res) => {
  return await Handler.submitAllocationList(req, res)
});
routers.post("/cancel-allocation", async (req, res) => {
  return await Handler.DeleteTempAllocationList(req, res);
});
routers.post("/get-allocation-school-list", async (req, res) => {
  return await Handler.allocationSchoolList(req, res);
});

module.exports = routers; 
