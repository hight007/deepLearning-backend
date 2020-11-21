const express = require("express");
const router = express.Router();
const user = require("./../model/user");
const bcrypt = require("bcryptjs");
const constants = require("./../constant/constant");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get("/user", async (req, res) => {
  try {
    let result = await user.findAll({
      attributes: [
        "username",
        "empNumber",
        "levelUser",
        "lastWebsite",
        "createdAt",
        "updatedAt",
      ],
      order: [["updatedAt", "DESC"]],
    });

    res.json({
      result,
      api_result: constants.kResultOk,
    });
  } catch (error) {
    res.json({
      error,
      api_result: constants.kResultNok,
    });
  }
});

router.get("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    let result = await user.findOne({
      attributes: [
        "username",
        "empNumber",
        "levelUser",
        "lastWebsite",
        "createdAt",
        "updatedAt",
      ],
      where: {
        username: username,
      },
    });
    res.json({
      result,
      api_result: constants.kResultOk,
    });
  } catch (error) {
    res.json({
      result: JSON.stringify(error),
      api_result: constants.kResultNok,
    });
  }
});

router.get("/user/keyword/:keyword", async (req, res) => {
  try {
    const { keyword } = req.params;
    let result = await user.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: "%" + keyword + "%" } },
          { empNumber: { [Op.like]: "%" + keyword + "%" } },
        ],
      },
    });
    res.json({
      result: result,
      api_result: constants.kResultOk,
    });
  } catch (error) {
    res.json({
      result: JSON.stringify(error),
      api_result: constants.kResultNok,
    });
  }
});

router.post("/user", async (req, res) => {
  try {
    // encrypt password
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    randomKey = makeid(10);
    req.body.randomKey = randomKey;
    let result = await user.create(req.body);

    res.json({
      result,
      api_result: constants.kResultOk,
    });
  } catch (error) {
    log(error);
    res.json({
      error,
      api_result: constants.kResultNok,
    });
  }
});

router.put("/user/password", async (req, res) => {
  try {
    console.log("start change password");
    const { username, newPassword, oldPassword } = req.body;
    let result = await user.findOne({ where: { username: username } });
    if (bcrypt.compareSync(oldPassword, result.password)) {
      await user.update(
        { password: bcrypt.hashSync(newPassword, 8) },
        { where: { username } }
      );
      console.log("SQL changed password");

      res.json({
        // result ,
        api_result: constants.kResultOk,
      });
    } else {
      res.json({
        api_result: constants.kResultNok,
        error: "Old password not match",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      api_result: constants.kResultNok,
      error,
    });
  }
});

router.put("/user/levelUser", async (req, res) => {
  try {
    console.log("start change levelUser");
    const { username, levelUser, editBy } = req.body;
    let result = await user.findOne({ where: { username: editBy } });
    if (result.levelUser === "admin" || result.levelUser === "power") {
      await user.update({ levelUser }, { where: { username } });
      console.log("SQL levelUser changed");

      res.json({
        // result ,
        api_result: constants.kResultOk,
      });
    } else {
      res.json({
        api_result: constants.kResultNok,
        error: "Authen levelUser failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      api_result: constants.kResultNok,
      error,
    });
  }
});

router.delete("/user", async (req, res) => {
  try {
    let result = await user.destroy({
      where: { username: req.body.username },
    });
    res.json({
      api_result: constants.kResultOk,
    });
  } catch (error) {
    res.json({
      api_result: constants.kResultNok,
      error,
    });
  }
});

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;
