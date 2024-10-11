const db = require("../db/db.Config");

const getAllFinalEstimate = async () => {
  try {
    const allFinalEstimate = await db.any("SELECT * FROM FinalEstimates");
    return allFinalEstimate;
  } catch (err) {
    console.error("internal error", err);
    throw err;
  }
};

const getOneFinalEstimate = async (estimateId) => {
  try {
    const oneFinalEstimate = await db.one(
      "SELECT * FROM FinalEstimates WHERE estimate_id=$1",
      [estimateId]
    );
    return oneFinalEstimate;
  } catch (err) {
    console.error("Error retrieving one final estimate:", err);
    throw err;
  }
};


const getEstimate = async (estimateId) => {
  try {
    const estimate = await db.oneOrNone(
      "SELECT * FROM Estimates WHERE id = $1",
      [estimateId]
    );
    if (!estimate) {
      throw new Error(`Estimate with ID ${estimateId} not found.`);
    }
    return estimate;
  } catch (error) {
    console.error("Error retrieving estimate", error);
    throw error;
  }
};

const getEquipmentItems = async (estimateId) => {
  try {
    const equipmentItems = await db.any(
      `
        SELECT ee.quantity, e.price 
        FROM EstimateEquipment ee 
        JOIN Equipment e ON ee.equipment_id = e.id 
        WHERE ee.estimate_id = $1
      `,
      [estimateId]
    );
    console.log("Equipment Items:", equipmentItems); 
    return equipmentItems;
  } catch (error) {
    console.error("Error retrieving equipment items", error);
    throw error;
  }
};

const getAccessoriesItems = async (estimateId) => {
  try {
    const accessoriesItems = await db.any(
      `
        SELECT ea.quantity, a.price 
        FROM EstimateAccessories ea 
        JOIN Accessories a ON ea.accessory_id = a.id 
        WHERE ea.estimate_id = $1
      `,
      [estimateId]
    );
    console.log("Accessories Items:", accessoriesItems); 
    return accessoriesItems;
  } catch (error) {
    console.error("Error retrieving accessories items", error);
    throw error;
  }
};


const insertFinalEstimate = async (
  estimateId, laborCost, equipmentCost, accessoriesCost, subtotal, tax, totalCost, 
) => {
  try {
    const result = await db.one(
      `INSERT INTO FinalEstimates (
        estimate_id, labor_cost, equipment_cost, accessories_cost, subtotal, tax, total_cost, 
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, 
      )
      ON CONFLICT (estimate_id) DO UPDATE SET
        labor_cost = EXCLUDED.labor_cost,
        equipment_cost = EXCLUDED.equipment_cost,
        accessories_cost = EXCLUDED.accessories_cost,
        subtotal = EXCLUDED.subtotal,
        tax = EXCLUDED.tax,
        total_cost = EXCLUDED.total_cost,
        
      RETURNING *`,
      [
        estimateId, laborCost, equipmentCost, accessoriesCost, subtotal, tax, totalCost, 
      ]
    );
    return result;
  } catch (err) {
    console.error("Error inserting or updating final estimate", err);
    throw err;
  }
};

module.exports = {
  getEstimate,
  getEquipmentItems,
  getAccessoriesItems,
  getAllFinalEstimate,
  getOneFinalEstimate,
  insertFinalEstimate
};
