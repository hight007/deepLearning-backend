const { Sequelize, DataTypes } = require("sequelize");
const database = require("./../instance/hb_instance");

const home_image = database.define(
  "defect",
  {
    // attributes
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    machine_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    defect: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    images: {
      type: Sequelize.DataTypes.BLOB("long"),
      allowNull: false,
    },
  },
  {
    //option
  }
);

(async () => {
  await home_image.sync({ force: false });
})();

module.exports = home_image;
