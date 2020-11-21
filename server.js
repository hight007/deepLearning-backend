const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "./files")));
app.use(cors());

app.use("/api/deepLearning/authen/", require("./api/api_authen"));
app.use("/api/deepLearning/manage_user/", require("./api/api_manage_user"));
app.use("/api/deepLearning/manage_master/", require("./api/api_manage_master"));
app.use("/api/deepLearning/deepLearning/", require("./api/api_deepLearning"));

app.listen(5000, () => {
  console.log("Backend is running...");
});
