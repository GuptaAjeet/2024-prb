const express = require('express');
const routers = express.Router();
const Handler = require('../../../app/handlers/Assets/twoFactorAuthHandler');

routers.post('/enable', async (req, res) => {
  return await Handler.generateQRCode(req, res)
});

routers.post('/verify-otp', async (req, res) => {
  return await Handler.verifyOTP(req, res);
});

routers.post('/disable', async (req, res) => {
  return await Handler.disable2FA(req, res)
});

routers.post('/check-status', async (req, res) => {
  return await Handler.checkTwoFAEnabled(req, res)
});

routers.post('/otp-login', async (req, res) => {
  return await Handler.otpBasedLogin(req, res)
});

module.exports = routers;