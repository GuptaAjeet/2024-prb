const express   =   require('express');
const routers   =   express.Router();
const Helper    =   require('../../helpers/Helper');
const Handler   =   require('../../handlers').HostelHandler;
const multer = require("multer");

const path = require("path");
const fs = require("fs");
const { UPLOAD_FILE_PATH } = require('../../../config/env');

function checkMimeType(file) {
    switch (file.mimetype) {
        case 'application/pdf':
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'image/png':
            return true;
        default:
            return false;
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (checkMimeType(file)) {
        let filePath = path.join(UPLOAD_FILE_PATH + "/fundreleased");

        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
        }
        cb(null, filePath);
      } else {
        cb(new Error('Invalid file type. Please upload a valid file.'));
      }
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
const upload = multer({ storage: storage });

routers.post('/create', upload.single("file"), (req,res) => {
    return Handler.create(req,res);
}); 

routers.post('/find',(req,res) => {
    return  Handler.find(req,res);
}); 

routers.get('/downloadfile/:id/', async (req, res) => {
  return await Handler.downloadFile(req, res);
});

module.exports = routers;
