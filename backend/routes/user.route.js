const express = require("express");
const { addForm, getForms , getFormById , updateFormById , deleteFormById } = require("../controllers/user.controller");
const userRouter = express.Router();


userController.post("/api/user", addForm);
userController.get("/api/user", getForms);
userController.get("/api/user/:id", getFormById);
userController.put("/api/user/:id", updateFormById);
userController.delete("/api/user/:id", deleteFormById);

module.exports= {userRouter}