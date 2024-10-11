const db = require("../db/db.Config.js");

// Get all Accessories
const getAllAccessories = async () => {
  try {
    const allAccessories = await db.any("SELECT * FROM Accessories");
    return allAccessories;
  } catch (err) {
    console.error("Error in accessories query", err);
    throw err;
  }
};

// Get a single Accessory by ID
const getOneAccessory = async (id) => {
  try {
    const oneAccessory = await db.one("SELECT * FROM Accessories WHERE id=$1", [id]);
    return oneAccessory;
  } catch (err) {
    console.error("Error in accessory query", err);
    throw err;
  }
};

// Update an Accessory
const updateAccessory = async (id, accessory) => {
  try {
    const { name, description, price } = accessory;
    const updatedAccessory = await db.one(
      "UPDATE Accessories SET name=$1, description=$2, price=$3 WHERE id=$4 RETURNING *",
      [name, description, price, id]
    );
    return updatedAccessory;
  } catch (err) {
    console.error("Error updating accessory", err);
    throw err;
  }
};

// Delete an Accessory
const deleteAccessory = async (id) => {
  try {
    const deletedAccessory = await db.one("DELETE FROM Accessories WHERE id=$1 RETURNING *", [id]);
    return deletedAccessory;
  } catch (err) {
    console.error("Error deleting accessory", err);
    throw err;
  }
};

// Create a new Accessory
const createAccessory = async (accessory) => {
  try {
    const { name, description, price } = accessory;
    const createdAccessory = await db.one(
      "INSERT INTO Accessories (name, description, price) VALUES($1, $2, $3) RETURNING *",
      [name, description, price]
    );
    return createdAccessory;
  } catch (err) {
    console.error("Error creating accessory", err);
    throw err;
  }
};


module.exports = {
  getAllAccessories,
  getOneAccessory,
  createAccessory,
  updateAccessory,
  deleteAccessory
};
