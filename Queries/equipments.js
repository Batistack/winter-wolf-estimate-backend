const db = require("../db/db.Config.js");

// Get all Equipment
const getAllEquipments = async () => {
  try {
    const allEquipments = await db.any("SELECT * FROM Equipment");
    return allEquipments;
  } catch (err) {
    console.error("Error getting all Equipment", err);
    throw err;
  }
};

// Get a single Equipment by ID
const getOneEquipment = async (id) => {
  try {
    const oneEquipment = await db.one("SELECT * FROM Equipment WHERE id=$1", [id]);
    return oneEquipment;
  } catch (err) {
    console.error("Error getting one Equipment", err);
    throw err;
  }
};

// Update Equipment
const updateEquipment = async (id, equipment) => {
  try {
    const { name, model_number, brand, description, price } = equipment;
    const updatedEquipment = await db.one(
      "UPDATE Equipment SET name=$1, model_number=$2, brand=$3, description=$4, price=$5 WHERE id=$6 RETURNING *",
      [name, model_number, brand, description, price, id]
    );
    return updatedEquipment;
  } catch (err) {
    console.error("Error updating Equipment", err);
    throw err;
  }
};

// Create new Equipment
const createEquipment = async (equipment) => {
  try {
    const { name, model_number, brand, description, price } = equipment;
    const createdEquipment = await db.one(
      "INSERT INTO Equipment (name, model_number, brand, description, price) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [name, model_number, brand, description, price]
    );
    return createdEquipment;
  } catch (err) {
    console.error("Error creating Equipment", err);
    throw err;
  }
};

// Delete Equipment by ID
const deleteEquipment = async (id) => {
  try {
    const deletedEquipment = await db.one(
      "DELETE FROM Equipment WHERE id=$1 RETURNING *",
      [id]
    );
    return deletedEquipment;
  } catch (err) {
    console.error("Error deleting Equipment", err);
    throw err;
  }
};

module.exports = {
  getAllEquipments,
  getOneEquipment,
  updateEquipment,
  createEquipment,
  deleteEquipment,
 
};
