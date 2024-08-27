const express = require("express");
const mongoose = require("mongoose");
const bodyParse = require("body-parser");
const cors = require("cors");
const FormData = require("./models/formsData");
const app = express();

app.use(cors());
app.use(bodyParse.json());

mongoose
  .connect("mongodb://localhost:27017/Angular-All-Data")
  .then(() => {
    console.log("Connected!!");
  })
  .catch((e) => {
    console.log(e);
  });

  app.post("/api/user",(req, res) => {
    try {
      const newUser =FormData.create(req.body);
      // console.log("New user created:", newUser);
      res.status(201).json({ message: "User data saved successfully", data: newUser });
    } catch (e) {
      console.error("Error saving user data:", e);
      res.status(500).json({ message: "Failed to save user data", error: e.message });
    }
  });

app.get("/", (req, res) => {
  res.send("Test Okay!");
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
