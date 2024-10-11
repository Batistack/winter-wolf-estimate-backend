const express = require("express");

const {
  getAllAccessories,
  getOneAccessory,
  createAccessory,
  updateAccessory,
  deleteAccessory,
} = require("../Queries/accesories.js");

const Accesories = express.Router();

Accesories.get("/", async (req, res) => {
  try {
    const AllAccesories = await getAllAccessories();
    res.status(200).json({ success: true, payload: AllAccesories });
  } catch (err) {
    console.error("Error fetching accesories", err);
    res.status(500).json({ success: false, error: "Internal server Error" });
  }
});

Accesories.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneAccesorie = await getOneAccessory(id);
    if (oneAccesorie) {
      res.status(200).json({ success: true, payload: oneAccesorie });
    } else {
      res
        .status(404)
        .json({ success: false, error: "error fetching one accesorie" });
    }
  } catch (error) {
    console.error("Error fetching one accesories", error);
    res.status(500).json({ success: false, error: "Internal error one fetch" });
  }
});

Accesories.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAccesory = await deleteAccessory(id);
    if (deletedAccesory) {
      res.status(200).json({ success: true, payload: deletedAccesory });
    } else {
      res
        .status(404)
        .json({ success: false, error: "Error deleting accesory" });
    }
  } catch (err) {
    console.error("Internal error", err);
    res.status(500).json({ success: false, error: "internal error" });
  }
});

Accesories.post("/", async (req, res) => {
  try {
    const createdAccesory = await createAccessory(req.body);
    if (createdAccesory) {
      res.status(200).json({ success: true, payload: createdAccesory });
    } else {
      res
        .status(404)
        .json({ success: false, error: "Error creating accesory" });
    }
  } catch (err) {
    console.error("internal error", err);
    res.status(500).json({ success: false, error: "internal error " });
  }
});

Accesories.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAccesories = await updateAccessory(id, req.body);
    if (updatedAccesories) {
      res.status(200).json({ success: true, payload: updatedAccesories });
    } else {
      res
        .status(404)
        .json({ success: false, error: "Error updating accesories" });
    }
  } catch (err) {
    console.error("internal error", err);
    res.status(500).json({ success: false, error: "Internal error" });
  }
});

module.exports = Accesories;
