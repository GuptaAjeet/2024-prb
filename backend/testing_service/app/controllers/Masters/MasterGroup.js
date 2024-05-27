const express = require("express");
const routers = express.Router();
const Handler = require("../../handlers").Mastergroup;

routers.get("/list", async (req, res) => {
  return await Handler.list(req, res);
});

routers.get("/dropdown", async (req, res) => {
  return await Handler.dropdown(req, res);
});

routers.get("/locations-dropdown", async (req, res) => {
  return await Handler.locationGroupDropdown(req, res);
});

module.exports = routers;
