const express = require("express");
const mongoose = require("mongoose");
const bodyParse = require("body-parser");
const cors = require("cors");
const FormData = require("./models/formsData");
const app = express();

app.use(cors());
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

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
      res.status(201).json({ message: "User data saved successfully", data: newUser });
    } catch (e) {
      console.error("Error saving user data:", e);
      res.status(500).json({ message: "Failed to save user data", error: e.message });
    }
  });

app.get("/api/user", async (req, res) => {
  try{
    const data = await FormData.find();
    res.status(200).json({ message: "Data fetched successfully", data: data}); 
  }
  catch(e){
    console.error("Error fetching data:", e);
    res.status(500).json({ message: "Failed to fetch data", error: e.message });
  }
});
app.get("/api/user/:id", async (req, res) => {
  try{
    const data = await FormData.findById(req.params.id);
    res.status(200).json({ message: "Data fetched successfully", data: data}); 
  }
  catch(e){
    console.error("Error fetching data:", e);
    res.status(500).json({ message: "Failed to fetch data", error: e.message });
  }
});
app.put("/api/user/:id", async (req, res) => {  
  try{
    const data = await FormData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Data updated successfully", data: data});  
  }
  catch(e){
    console.error("Error updating data:", e);
    res.status(500).json({ message: "Failed to update data", error: e.message });
  }
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
