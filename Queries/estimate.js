const db = require("../db/db.Config.js");
const {
  calculateFinalEstimate,
  recalculateFinalEstimate,
} = require("../services.js");

const getAllEstimate = async () => {
  try {
    const allEstimate = await db.any("SELECT * FROM Estimates");
    return allEstimate;
  } catch (err) {
    console.error("Internal error", err);
    throw err;
  }
};

const getOneEstimate = async (id) => {
  try {
    const oneEstimate = await db.one("SELECT * FROM Estimates WHERE id=$1", [
      id,
    ]);
    return oneEstimate;
  } catch (err) {
    console.error("Internal error ", err);
    throw err;
  }
};

const deleteEstimate = async (id) => {
  try {
    await db.tx(async (t) => {
      await t.none("DELETE FROM FinalEstimates WHERE estimate_id = $1", [id]);
      const deletedEstimate = await t.one(
        "DELETE FROM Estimates WHERE id=$1 RETURNING *",
        [id]
      );
      return deletedEstimate;
    });

    return {
      success: true,
      message: "Estimate and final estimate deleted successfully",
    };
  } catch (err) {
    console.error("Internal error", err);
    throw err;
  }
};

const updateEstimate = async (
  id,
  estimateData,
  equipmentItems = [],
  accessoryItems = []
) => {
  try {
    console.log("Equipment Items:", equipmentItems);
    console.log("Accessories Items:", accessoryItems);

    await db.none(
      `UPDATE Estimates
         SET client_name = $1, client_address = $2, client_phone = $3, labor_hours = $4, labor_rate = $5, tax_rate = $6, market_cap = $7, details = $8
         WHERE id = $9`,
      [
        estimateData.client_name,
        estimateData.client_address,
        estimateData.client_phone,
        estimateData.labor_hours,
        estimateData.labor_rate,
        estimateData.tax_rate,
        estimateData.market_cap,
        JSON.stringify(estimateData.details),
        id,
      ]
    );

    // Remove existing items
    await db.none(`DELETE FROM EstimateEquipment WHERE estimate_id = $1`, [id]);
    await db.none(`DELETE FROM EstimateAccessories WHERE estimate_id = $1`, [
      id,
    ]);

    // Insert or update equipment items
    for (const item of equipmentItems) {
      await db.none(
        `INSERT INTO EstimateEquipment (estimate_id, equipment_id, quantity) 
           VALUES ($1, $2, $3)
           ON CONFLICT (estimate_id, equipment_id) 
           DO UPDATE SET quantity = EXCLUDED.quantity`,
        [id, item.id, item.quantity]
      );
    }

    // Insert or update accessory items
    for (const item of accessoryItems) {
      await db.none(
        `INSERT INTO EstimateAccessories (estimate_id, accessory_id, quantity) 
           VALUES ($1, $2, $3)
           ON CONFLICT (estimate_id, accessory_id) 
           DO UPDATE SET quantity = EXCLUDED.quantity`,
        [id, item.id, item.quantity]
      );
    }

    // Recalculate the final estimate
    await recalculateFinalEstimate(id);

    // Fetch and return the updated estimate
    const updatedEstimate = await getOneEstimate(id);
    return updatedEstimate;
  } catch (error) {
    console.error("Error updating estimate:", error);
    throw error;
  }
};

const createEstimate = async (
  estimateData,
  equipmentItems = [],
  accessoryItems = []
) => {
  try {
    const result = await db.query(
      "INSERT INTO Estimates (client_name, client_address, client_phone, labor_hours, labor_rate, tax_rate, market_cap, details, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      [
        estimateData.client_name,
        estimateData.client_address,
        estimateData.client_phone,
        estimateData.labor_hours,
        estimateData.labor_rate,
        estimateData.tax_rate,
        estimateData.market_cap,
        JSON.stringify(estimateData.details),
        estimateData.user_id,
      ]
    );

    const estimateId = result[0]?.id;

    if (!estimateId) {
      throw new Error("Failed to retrieve estimate ID.");
    }

    // Insert or update equipment items
    await Promise.all(
      equipmentItems.map((item) =>
        db.query(
          `INSERT INTO EstimateEquipment (estimate_id, equipment_id, quantity)
                VALUES ($1, $2, $3)
                ON CONFLICT (estimate_id, equipment_id)
                DO UPDATE SET quantity = EXCLUDED.quantity`,
          [estimateId, item.id, item.quantity]
        )
      )
    );

    // Insert or update accessory items
    await Promise.all(
      accessoryItems.map((item) =>
        db.query(
          `INSERT INTO EstimateAccessories (estimate_id, accessory_id, quantity)
                VALUES ($1, $2, $3)
                ON CONFLICT (estimate_id, accessory_id)
                DO UPDATE SET quantity = EXCLUDED.quantity`,
          [estimateId, item.id, item.quantity]
        )
      )
    );

    // Calculate and insert final estimate
    const finalEstimate = await calculateFinalEstimate(estimateId);

    if (!finalEstimate.success) {
      throw new Error(
        finalEstimate.error || "Error calculating final estimate."
      );
    }

    return {
      success: true,
      data: finalEstimate.payload,
    };
  } catch (error) {
    console.error(
      "Error creating estimate or calculating final estimate:",
      error.message
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  getAllEstimate,
  getOneEstimate,
  updateEstimate,
  deleteEstimate,
  createEstimate,
};
