const express = require("express");
const mongoose = require("mongoose");
const bodyParse = require("body-parser");
const cors = require("cors");
const {userRouter} = require("./routes/user.route");
const {clientRouter} = require("./routes/client.route");
const app = express();

app.use(cors());
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));


app.use('/api/user',userRouter);
app.use('/api/client',clientRouter);

mongoose
  .connect("mongodb://localhost:27017/Angular-All-Data")
  .then(() => {
    console.log("Connected!!");
  })
  .catch((e) => {
    console.log(e);
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
