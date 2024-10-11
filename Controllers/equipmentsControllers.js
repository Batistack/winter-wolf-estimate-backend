const express = require("express");


const {
  getAllEquipments,
  getOneEquipment,
  updateEquipment,
  createEquipment,
  deleteEquipment
} = require("../Queries/equipments");

const Equipment = express.Router();

Equipment.get("/", async (req, res) => {
  try {
    const allEquipments = await getAllEquipments();
    res.status(200).json({ success: true, payload: allEquipments });
  } catch (err) {
    console.error("Error fetching all equipments", err);
    res.status(500).json({ success: false, error: "Internal error" });
  }
});

Equipment.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneEquipment = await getOneEquipment(id);
    if (oneEquipment) {
      res.status(200).json({ success: true, payload: oneEquipment });
    } else {
      res
        .status(404)
        .json({ success: false, error: "error gettingg one equipment" });
    }
  } catch (error) {
    console.error("Internal error", error);
    res.status(500).json({ success: false, error: "Internal Error" });
  }
});

Equipment.post("/", async (req, res) => {
  try {
    const createdEquipment = await createEquipment(req.body);
    if (createdEquipment) {
      res.status(200).json({ success: true, payload: createdEquipment });
    } else {
      res
        .status(404)
        .json({ success: false, error: "error creating equipment" });
    }
  } catch (err) {
    console.error("Internal error creating equipment", err);
    res.status(500).json({ success: false, error: "error creating" });
  }
});

Equipment.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEquipment = await updateEquipment(id, req.body);
    if (updatedEquipment) {
      res.status(200).json({ success: true, payload: updatedEquipment });
    } else {
      res
        .status(404)
        .json({ success: false, error: "error creating equipment" });
    }
  } catch (err) {
    console.error("internal error updating equipment", err);
    res.status(500).json({ success: false, error: "internal error" });
  }
});

Equipment.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEquipment = await deleteEquipment(id);
    if (deletedEquipment) {
      res.status(200).json({ success: true, payload: deletedEquipment });
    } else {
      res
        .status(404)
        .json({ success: false, error: "error deleting equipment" });
    }
  } catch (err) {
    console.error("internal error deleting");
    res.status(500).json({ success: false, error: "internal error" });
  }
});
module.exports = Equipment;
