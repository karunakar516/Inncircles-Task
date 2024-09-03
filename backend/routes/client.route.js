const express = require("express");
const { postData} = require("../controllers/clientForm.controller");
const clientRouter = express.Router();
clientRouter.post("/", postData);
module.exports= {clientRouter}