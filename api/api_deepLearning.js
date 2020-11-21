const express = require("express");
const constants = require("../constant/constant");
const router = express.Router();
const fs = require("fs");
const formidable = require("formidable");
const defect = require("../model/deepLearning");

router.post("/defect", async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    await form.parse(req, async (error, fields, files) => {
      console.log("error : " + JSON.stringify(error));
      console.log("Fields : " + JSON.stringify(fields));
      console.log("Files : " + JSON.stringify(files));

      var data = {
        machine_number: fields.machine_number,
        defect: fields.defect,
        images: await fs.readFileSync(files.image.path),
      };

      let result = await defect.create(data);

      res.json({
        // result,
        api_result: constants.kResultOk,
      });
    });
  } catch (error) {
    res.json({
      api_result: constants.kResultNok,
      error,
    });
  }
});

router.get("/defect/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let result = await defect.findOne({ where: { id: id } });
    //   res.type(result.fileType);
    res.type(".jpg");
    res.end(result.images);
  } catch (error) {
    res.json({
      error,
      api_result: constants.kResultNok,
    });
  }
});

module.exports = router;
