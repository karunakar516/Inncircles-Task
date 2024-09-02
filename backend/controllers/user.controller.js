const FormData = require("./models/formsData");

const addForm = async (req, res) => {
    try {
      const newUser =await FormData.create(req.body);
      res.status(201).json({ message: "User data saved successfully", data: newUser });
    } catch (e) {
      console.error("Error saving user data:", e);
      res.status(500).json({ message: "Failed to save user data", error: e.message });
    }
};

const getForms= async (req, res) => {
  try{
    const data = await FormData.find();
    res.status(200).json({ message: "Data fetched successfully", data: data}); 
  }
  catch(e){
    console.error("Error fetching data:", e);
    res.status(500).json({ message: "Failed to fetch data", error: e.message });
  }
};
const getFormById= async (req, res) => {
  try{
    const data = await FormData.findById(req.params.id);
    res.status(200).json({ message: "Data fetched successfully", data: data}); 
  }
  catch(e){
    console.error("Error fetching data:", e);
    res.status(500).json({ message: "Failed to fetch data", error: e.message });
  }
};
const updateFormById= async (req, res) => {  
  try{
    const data = await FormData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Data updated successfully", data: data});  
  }
  catch(e){
    console.error("Error updating data:", e);
    res.status(500).json({ message: "Failed to update data", error: e.message });
  }
};
const deleteFormById= async (req, res) => {
  try{
    const data = await FormData.findByIdAndDelete(req.params.id); 
    res.status(200).json({ message: "Data deleted successfully", data: data});
  } 
  catch(e){
    console.error("Error deleting data:", e);
    res.status(500).json({ message: "Failed to delete data", error: e.message });
  }
};

module.exports = { addForm, getForms, getFormById, updateFormById, deleteFormById};