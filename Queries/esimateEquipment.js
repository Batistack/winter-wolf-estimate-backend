const db = require("../db/db.Config.js");

// Add Equipment to an Estimate
const addEquipmentToEstimate = async (
  estimateId,
  equipmentId,
  quantity,
  floor_name,
  room_name
) => {
  try {
    const addedEquipment = await db.one(
      "INSERT INTO EstimateEquipment (estimate_id, equipment_id, quantity,floor_name, room_name) VALUES ($1, $2, $3,$4,$5) RETURNING *",
      [estimateId, equipmentId, quantity, floor_name, room_name]
    );
    return addedEquipment;
  } catch (err) {
    console.error("Error adding Equipment to Estimate", err);
    throw err;
  }
};

// Get Equipment for a Specific Estimate
const getEquipmentsForEstimate = async (estimateId) => {
  try {
    const equipments = await db.any(
      "SELECT * FROM EstimateEquipment WHERE estimate_id=$1",
      [estimateId]
    );
    return equipments;
  } catch (err) {
    console.error("Error getting Equipment for Estimate", err);
    throw err;
  }
};

// Update Equipment in an Estimate
const updateEstimateEquipment = async (id, quantity) => {
  try {
    const updatedEquipment = await db.one(
      "UPDATE EstimateEquipment SET quantity=$1 WHERE id=$2 RETURNING *",
      [quantity, id]
    );
    return updatedEquipment;
  } catch (err) {
    console.error("Error updating Equipment in Estimate", err);
    throw err;
  }
};

// Delete Equipment from an Estimate
const deleteEquipmentFromEstimate = async (id) => {
  try {
    const deletedEquipment = await db.one(
      "DELETE FROM EstimateEquipment WHERE id=$1 RETURNING *",
      [id]
    );
    return deletedEquipment;
  } catch (err) {
    console.error("Error deleting Equipment from Estimate", err);
    throw err;
  }
};

module.exports = {
  addEquipmentToEstimate,
  getEquipmentsForEstimate,
  updateEstimateEquipment,
  deleteEquipmentFromEstimate,
};
