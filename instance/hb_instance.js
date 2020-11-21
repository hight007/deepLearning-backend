const Sequelize = require("sequelize");
const sequelize = new Sequelize("deepLearning", "sa", "P@ssw0rd", {
  host: "10.121.42.48",
  dialect: "mssql",
  dialectOptions: {
    options: {
      instanceName: "",
    },
  },
});

(async () => {
  await sequelize.authenticate();
})();

module.exports = sequelize;
