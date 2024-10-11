const express = require("express");
const {
  addAccessoryToEstimate,
  getAccessoriesForEstimate,
  updateEstimateAccessory,
  deleteAccessoryFromEstimate
} = require("../Queries/estimateAccesories"); 

const AccessoryController = express.Router();

// Add Accessory to an Estimate
AccessoryController.post("/:estimateId/accessories", async (req, res) => {
  const { estimateId } = req.params;
  const { accessoryId, quantity } = req.body;

  if (!accessoryId || quantity === undefined) {
    return res.status(400).json({ success: false, error: "Accessory ID and quantity are required" });
  }

  try {
    const addedAccessory = await addAccessoryToEstimate(estimateId, accessoryId, quantity);
    res.status(201).json({ success: true, payload: addedAccessory });
  } catch (err) {
    console.error("Error adding accessory to estimate:", err);
    res.status(500).json({ success: false, error: "Internal error adding accessory to estimate" });
  }
});

// Get Accessories for a Specific Estimate
AccessoryController.get("/:estimateId/accessories", async (req, res) => {
  const { estimateId } = req.params;

  try {
    const accessories = await getAccessoriesForEstimate(estimateId);
    if (accessories.length > 0) {
      res.status(200).json({ success: true, payload: accessories });
    } else {
      res.status(404).json({ success: false, error: "No accessories found for this estimate" });
    }
  } catch (err) {
    console.error("Error getting accessories for estimate:", err);
    res.status(500).json({ success: false, error: "Internal error getting accessories for estimate" });
  }
});

// Update Accessory in an Estimate
AccessoryController.put("/accessories/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({ success: false, error: "Quantity is required" });
  }

  try {
    const updatedAccessory = await updateEstimateAccessory(id, quantity);
    res.status(200).json({ success: true, payload: updatedAccessory });
  } catch (err) {
    console.error("Error updating accessory in estimate:", err);
    res.status(500).json({ success: false, error: "Internal error updating accessory in estimate" });
  }
});

// Delete Accessory from an Estimate
AccessoryController.delete("/accessories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAccessory = await deleteAccessoryFromEstimate(id);
    res.status(200).json({ success: true, payload: deletedAccessory });
  } catch (err) {
    console.error("Error deleting accessory from estimate:", err);
    res.status(500).json({ success: false, error: "Internal error deleting accessory from estimate" });
  }
});

module.exports = AccessoryController;
