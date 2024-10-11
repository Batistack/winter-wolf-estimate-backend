const db = require("../db/db.Config.js");

// Add Accessory to an Estimate
const addAccessoryToEstimate = async (
  estimateId,
  accessoryId,
  quantity,
  floor_name,
  room_name
) => {
  try {
    const addedAccessory = await db.one(
      "INSERT INTO EstimateAccessories (estimate_id, accessory_id, quantity ,floor_name, room_name) VALUES ($1, $2, $3 ,$4,$5) RETURNING *",
      [estimateId, accessoryId, quantity, floor_name, room_name]
    );
    return addedAccessory;
  } catch (err) {
    console.error("Error adding Accessory to Estimate", err);
    throw err;
  }
};

// Get Accessories for a Specific Estimate
const getAccessoriesForEstimate = async (estimateId) => {
  try {
    const accessories = await db.any(
      "SELECT * FROM EstimateAccessories WHERE estimate_id=$1",
      [estimateId]
    );
    return accessories;
  } catch (err) {
    console.error("Error getting Accessories for Estimate", err);
    throw err;
  }
};

// Update Accessory in an Estimate
const updateEstimateAccessory = async (id, quantity) => {
  try {
    const updatedAccessory = await db.one(
      "UPDATE EstimateAccessories SET quantity=$1 WHERE id=$2 RETURNING *",
      [quantity, id]
    );
    return updatedAccessory;
  } catch (err) {
    console.error("Error updating Accessory in Estimate", err);
    throw err;
  }
};

// Delete Accessory from an Estimate
const deleteAccessoryFromEstimate = async (id) => {
  try {
    const deletedAccessory = await db.one(
      "DELETE FROM EstimateAccessories WHERE id=$1 RETURNING *",
      [id]
    );
    return deletedAccessory;
  } catch (err) {
    console.error("Error deleting Accessory from Estimate", err);
    throw err;
  }
};

module.exports = {
  addAccessoryToEstimate,
  getAccessoriesForEstimate,
  updateEstimateAccessory,
  deleteAccessoryFromEstimate,
};
