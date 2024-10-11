const db = require("./db/db.Config.js");
const {
  getEstimate,
  getEquipmentItems,
  getAccessoriesItems,
  insertFinalEstimate,
} = require("./Queries/finalEstimate");

const calculateCosts = (items) =>
  items.reduce(
    (total, item) =>
      total + parseFloat(item.price) * parseInt(item.quantity, 10),
    0
  );

  const calculateFinalEstimate = async (estimateId) => {
    try {
      console.log("Calculating final estimate for estimate ID:", estimateId);
  
      // Fetch estimate and items
      const estimate = await db.one("SELECT * FROM Estimates WHERE id=$1", [
        estimateId,
      ]);
      const equipmentItems = await db.any(
        "SELECT * FROM EstimateEquipment WHERE estimate_id=$1",
        [estimateId]
      );
      const accessoryItems = await db.any(
        "SELECT * FROM EstimateAccessories WHERE estimate_id=$1",
        [estimateId]
      );
  
      // Calculate costs
      let equipmentTotal = 0;
      let accessoriesTotal = 0;
  
      for (const item of equipmentItems) {
        if (item.quantity > 0) {
          const equipment = await db.one(
            "SELECT price FROM Equipment WHERE id=$1",
            [item.equipment_id]
          );
          equipmentTotal +=
            (parseFloat(equipment.price) || 0) * parseInt(item.quantity, 10);
        }
      }
  
      for (const item of accessoryItems) {
        if (item.quantity > 0) {
          const accessory = await db.one(
            "SELECT price FROM Accessories WHERE id=$1",
            [item.accessory_id]
          );
          accessoriesTotal +=
            (parseFloat(accessory.price) || 0) * parseInt(item.quantity, 10);
        }
      }
  
      const laborCost =
        parseFloat(estimate.labor_hours) * parseFloat(estimate.labor_rate);
      const materialCost = equipmentTotal + accessoriesTotal;
      const tax = materialCost * parseFloat(estimate.tax_rate);
      const subtotal = materialCost + laborCost + tax;
      const market_cap = subtotal / parseFloat(estimate.market_cap || 1);
      const totalCost = subtotal + market_cap;
      await db.none(
        `
        UPDATE Estimates
        SET market_cap = $2
        WHERE id = $1
      `,
        [estimateId, market_cap]
      );
      await db.none(
        `
        UPDATE Estimates
        SET equipment_cost = $2
        WHERE id = $1
      `,
        [estimateId, equipmentTotal]
      );
      await db.none(
        `
        UPDATE Estimates
        SET accessories_cost = $2
        WHERE id = $1
      `,
        [estimateId, accessoriesTotal]
      );
      // Insert into FinalEstimates table
      await db.none(
        `
        INSERT INTO FinalEstimates (estimate_id, labor_cost, equipment_cost, accessories_cost, subtotal, tax, total_cost)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (estimate_id)
        DO UPDATE SET labor_cost = EXCLUDED.labor_cost, equipment_cost = EXCLUDED.equipment_cost, 
          accessories_cost = EXCLUDED.accessories_cost, subtotal = EXCLUDED.subtotal, 
          tax = EXCLUDED.tax, total_cost = EXCLUDED.total_cost
      `,
        [
          estimateId,
          laborCost,
          equipmentTotal,
          accessoriesTotal,
          subtotal,
          tax,
          totalCost,
        ]
      );
  
      return {
        success: true,
        payload: { estimateId, totalCost, market_cap},
      };
    } catch (error) {
      console.error("Error calculating final estimate:", error);
      return { success: false, error: error.message };
    }
  };
  

const recalculateFinalEstimate = async (estimateId) => {
  try {
    // Fetch the updated estimate
    const estimate = await getEstimate(estimateId);
    if (!estimate) {
      throw new Error(`Estimate with ID ${estimateId} not found.`);
    }

    // Fetch the updated equipment and accessory items
    const equipmentItems = await getEquipmentItems(estimateId);
    const totalEquipmentCost = calculateCosts(equipmentItems);

    const accessoryItems = await getAccessoriesItems(estimateId);
    const totalAccessoriesCost = calculateCosts(accessoryItems);

    const laborCost =
      parseFloat(estimate.labor_hours) * parseFloat(estimate.labor_rate);
    const materialCost = totalEquipmentCost + totalAccessoriesCost;
    const tax = materialCost * parseFloat(estimate.tax_rate);
    const subtotal = materialCost + laborCost + tax;
    const finalTotalDivided = subtotal / parseFloat(estimate.market_cap || 1);
    const totalCost = subtotal + finalTotalDivided;

    
    // Update or insert the final estimate in the database
    const finalEstimate = await db.one(
      `
      INSERT INTO FinalEstimates (
        estimate_id, labor_cost, equipment_cost, accessories_cost, subtotal, tax, total_cost, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP
      )
      ON CONFLICT (estimate_id) DO UPDATE SET
        labor_cost = EXCLUDED.labor_cost,
        equipment_cost = EXCLUDED.equipment_cost,
        accessories_cost = EXCLUDED.accessories_cost,
        subtotal = EXCLUDED.subtotal,
        tax = EXCLUDED.tax,
        total_cost = EXCLUDED.total_cost,
        created_at = CURRENT_TIMESTAMP
      RETURNING *
    `,
      [
        estimateId,
        laborCost,
        totalEquipmentCost,
        totalAccessoriesCost,
        subtotal,
        tax,
        totalCost,
      ]
    );

    return finalEstimate;
  } catch (error) {
    console.error("Error recalculating final estimate:", error);
    throw error;
  }
};

module.exports = { calculateFinalEstimate, recalculateFinalEstimate };
