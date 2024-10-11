const express = require("express");
const {
  getAllFinalEstimate,
  getOneFinalEstimate,
} = require("../Queries/finalEstimate");

const calculateFinalEstimate = require("../services");

const { updateEstimate, createEstimate } = require("../Queries/estimate");

const FinaleEstimate = express.Router();

FinaleEstimate.get("/", async (req, res) => {
  try {
    const allEstimates = await getAllFinalEstimate();
    if (allEstimates.length > 0) {
      res.status(200).json({ success: true, payload: allEstimates });
    } else {
      res
        .status(404)
        .json({ success: false, error: "No final estimates found" });
    }
  } catch (err) {
    console.error("Error fetching final estimates:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
FinaleEstimate.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneFinalEstimate = await getOneFinalEstimate(id);
    if (oneFinalEstimate) {
      res.status(200).json({ success: true, payload: oneFinalEstimate });
    } else {
      res.status(404).json({ success: false, error: "Final estimate not found" });
    }
  } catch (err) {
    console.error("Internal error retrieving one estimate:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});


FinaleEstimate.post("/", async (req, res) => {
  const { estimateData, equipmentItems = [], accessoryItems = [] } = req.body;

  if (!estimateData) {
    return res
      .status(400)
      .json({ success: false, error: "Estimate data is required" });
  }

  try {
    const finalEstimateResult = await createEstimate(
      estimateData,
      equipmentItems,
      accessoryItems
    );
    if (!finalEstimateResult.success) {
      throw new Error(finalEstimateResult.error);
    }

    const finalEstimate = await calculateFinalEstimate(
      finalEstimateResult.data.id
    );
    res.status(201).json({ success: true, payload: finalEstimate });
  } catch (err) {
    console.error("Error creating final estimate:", err);
    res
      .status(500)
      .json({ success: false, error: "Error creating final estimate" });
  }
});

FinaleEstimate.put("/:id", async (req, res) => {
  const estimateId = parseInt(req.params.id, 10);
  const updatedEstimateData = req.body;
  if (isNaN(estimateId)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid estimate ID" });
  }

  try {
    await updateEstimate(estimateId, updatedEstimateData);
    const finalEstimate = await calculateFinalEstimate(estimateId);

    res.status(200).json({ success: true, payload: finalEstimate });
  } catch (err) {
    console.error("Error updating final estimate:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = FinaleEstimate;
