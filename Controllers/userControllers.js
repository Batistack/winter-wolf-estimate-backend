const express = require("express");

const {
  getAllUsers,
  getOneUser,
  updateUser,
  createUser,
  deleteUser,
  authenticateUser,
} = require("../Queries/user.js");

const User = express.Router();

User.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const authenticatedUser = await authenticateUser(username, password);
    res.status(200).json({ success: true, payload: authenticatedUser });
  } catch (err) {
    console.error("Error logging user", err);
    res.status(401).json({ success: false, message: "Invalid credential" });
  }
});

User.get("/", async (req, res) => {
  try {
    const allUsers = await getAllUsers();
    if (allUsers.length > 0) {
      res.status(200).json({ success: true, payload: allUsers });
    }
  } catch (err) {
    console.error("Error getting user", err);
    res.status(500).json({ success: false, error: "internal error" });
  }
});
User.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneUser = await getOneUser(id);
    if (oneUser) {
      res.status(200).json({ success: true, payload: oneUser });
    } else {
      res.status(404).json({ success: false, error: "error finding users" });
    }
  } catch (err) {
    console.error("Error getting one user", err);
    res.status(500).json({ success: false, error: "internal error" });
  }
});

User.post("/", async (req, res) => {
  try {
    const createdUser = await createUser(req.body);
    if (createdUser) {
      res.status(200).json({ success: true, payload: createdUser });
    } else {
      res.status(404).json({ success: false, error: "Error creating user" });
    }
  } catch (err) {
    console.error("internal error creating", err);
    res.status(500).json({ success: false, error: "internal error" });
  }
});

User.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUser(id, req.body);
    if (updatedUser) {
      res.status(200).json({ success: true, payload: updatedUser });
    } else {
      res.status(404).json({ success: false, error: "error updating user" });
    }
  } catch (err) {
    console.error("Internal error", err);
    res.status(500).json({ success: false, error: "Internal error" });
  }
});

User.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);
    if (deletedUser) {
      res.status(200).json({ success: true, payload: deletedUser });
    } else {
      res.status(404).json({ success: false, error: "Error deleting user" });
    }
  } catch (err) {
    console.error("Internal error", err);
    res.status(500).json({ success: false, error: "Internal error delete" });
  }
});

module.exports = User;
