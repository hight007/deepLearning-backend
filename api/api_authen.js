const express = require("express");
const router = express.Router();
const user = require("./../model/user");
const bcrypt = require("bcryptjs");
const constants = require("./../constant/constant");
const Sequelize = require("sequelize");

router.post("/login", async (req, res) => {
  try {
    const { username, password, lastWebsite } = req.body;
    
    if (lastWebsite == null) {
      lastWebsite = "";
    }

    let result = await user.findOne({ where: { username: username } });
    if (result != null) {
      if (
        result.levelUser == "user" ||
        result.levelUser == "power" ||
        result.levelUser == "admin"
      ) {
        if (bcrypt.compareSync(password, result.password)) {
          await user.update({ lastWebsite }, { where: { username } });
          console.log("Pass");
          res.json({
            result,
            api_result: constants.kResultOk,
          });
        } else {
          console.log("Incorrect password");
          res.json({
            error: "Incorrect password",
            api_result: constants.kResultNok,
          });
        }
      } else {
        console.log("Please validate email");
        res.json({
          error: "Please validate email",
          api_result: constants.kResultNok,
        });
      }
    } else {
      console.log("Username not found please register");
      res.json({
        error: "Username not found please register",
        api_result: constants.kResultNok,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: constants.kResultNok,
    });
  }
});

module.exports = router;
