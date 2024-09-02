const express = require("express");
const { addForm, getForms , getFormById , updateFormById , deleteFormById } = require("../controllers/user.controller");
const userRouter = express.Router();


userRouter.post("/", addForm);
userRouter.get("/", getForms);
userRouter.get("/:id", getFormById);
userRouter.put("/:id", updateFormById);
userRouter.delete("/:id", deleteFormById);

module.exports= {userRouter}