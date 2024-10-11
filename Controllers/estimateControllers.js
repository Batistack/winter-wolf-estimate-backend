const express = require("express");

const {
  getAllEstimate,
  getOneEstimate,
  updateEstimate,
  deleteEstimate,
  createEstimate,
} = require("../Queries/estimate.js");
const { calculateFinalEstimate } = require("../services.js");
const Estimate = express.Router();

Estimate.get("/", async (req, res) => {
  try {
    const allEstimate = await getAllEstimate();
    if (allEstimate.length > 0) {
      res.status(200).json({ success: true, payload: allEstimate });
    } else {
      res.status(404).json({ success: false, error: "No estimates found" });
    }
  } catch (err) {
    console.error("internal error", err);
    res
      .status(500)
      .json({ success: false, error: "internal error fetching estimates" });
  }
});
Estimate.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneEstimate = await getOneEstimate(id);
    if (oneEstimate) {
      res.status(200).json({ success: true, payload: oneEstimate });
    } else {
      res
        .status(404)
        .json({ success: false, error: "Error retriving one estimate" });
    }
  } catch (err) {
    console.error("internal error", err);
    res
      .status(500)
      .json({ success: false, error: "Error retriving one estimate" });
  }
});
// Example after creating a new estimate
Estimate.post("/", async (req, res) => {
  try {
    const { estimateData, equipmentItems = [], accessoryItems = [] } = req.body;
    if (!estimateData) {
      throw new Error("Estimate data is required");
    }

    const newEstimateResult = await createEstimate(
      estimateData,
      equipmentItems,
      accessoryItems
    );

    if (!newEstimateResult.success) {
      throw new Error(newEstimateResult.error);
    }

    console.log("New estimate created:", newEstimateResult);

    res.status(200).json({ success: true, payload: newEstimateResult.data });
  } catch (err) {
    console.error(
      "Error creating estimate or calculating final estimate:",
      err
    );
    res
      .status(500)
      .json({
        success: false,
        error: "Error creating estimate or calculating final estimate",
      });
  }
});

Estimate.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { estimateData, equipmentItems, accessoryItems } = req.body;

    if (!estimateData) {
      return res
        .status(400)
        .json({ success: false, error: "Estimate data is required" });
    }

    // Call the update function and get the updated estimate
    const updatedEstimate = await updateEstimate(
      id,
      estimateData,
      equipmentItems,
      accessoryItems
    );

    res.status(200).json({ success: true, payload: updatedEstimate });
  } catch (error) {
    console.error("Error updating estimate:", error);
    res.status(500).json({ success: false, error: "Error updating estimate" });
  }
});

Estimate.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deletedEstimate = await deleteEstimate(id);

    res.status(200).json({ success: true, payload: deletedEstimate });
  } catch (error) {
    console.error("Error deleting estimate:", error);
    res.status(500).json({ success: false, error: "Error deleting estimate" });
  }
});

module.exports = Estimate;
