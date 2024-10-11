const express = require("express");
const cors = require("cors");
const app = express();
const accesoriesControllers = require("./Controllers/accesoriesControllers.js");
const equipmentControllers = require("./Controllers/equipmentsControllers.js");
const userControllers = require("./Controllers/userControllers.js");
const finalEstimateControllers = require("./Controllers/finalEstimateControllers.js");
const estimateController = require("./Controllers/estimateControllers.js");
const accesoryController = require("./Controllers/accesoriesControllers.js")
app.use(cors());
app.use(express.json());

app.use("/accesories", accesoriesControllers);
app.use("/equipments", equipmentControllers);
app.use("/Users", userControllers);
app.use("/finalEstimate" , finalEstimateControllers)
app.use("/estimate", estimateController);
app.use("/accesoryEstimate", accesoryController)
app.get("/", (req, res) => {
  res.send("Welcome to winter wolf estimate");
});
app.get("*", (req, res) => {
  res.status(404).json({ success: false, data: { error: "page not found" } });
});

module.exports = app;
