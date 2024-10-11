const bcrypt = require("bcrypt");
const db = require("../db/db.Config.js");

const getAllUsers = async () => {
  try {
    const allUsers = await db.any("SELECT * FROM Users");
    return allUsers;
  } catch (err) {
    console.error("Error retrieving users", err);
    throw err;
  }
};

const getOneUser = async (id) => {
  try {
    const oneUser = await db.one("SELECT * FROM Users WHERE id=$1", [id]);
    return oneUser;
  } catch (error) {
    console.error("Error retrieving one user", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const deletedUser = await db.one(
      "DELETE FROM Users WHERE id=$1 RETURNING *",
      [id]
    );
    return deletedUser;
  } catch (error) {
    console.error("Error deleting User", error);
    throw error;
  }
};

const authenticateUser = async (username, password) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE username=$1", [
      username,
    ]);
    if (!user) {
      throw new Error("Invalid username");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("invalid password");
    }
    delete user.password;
    return user
  } catch (err) {
    console.error("Error during user authentication", err);
    throw err;
  }
};

const updateUser = async (id, user) => {
  try {
    const { name, username, email, password, role } = user;

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const updatedUser = await db.one(
      "UPDATE users SET name = COALESCE($1, name), username = COALESCE($2 , username) ,email = COALESCE($3 , email) , password = COALESCE($4 , password) , role = COALESCE($5 , role) WHERE id=$6 RETURNING * ",
      [name, username, email, hashedPassword, role, id]
    );
    return updatedUser;
  } catch (err) {
    console.error("error updating user", err);
    throw err;
  }
};

const createUser = async (user) => {
  try {
    const existingUser = await db.oneOrNone(
      "SELECT * FROM users WHERE username=$1 OR email=$2",
      [user.username, user.email]
    );
    if (existingUser) {
      throw new Error("Name, username or email is already registered");
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await db.one(
      "INSERT INTO users (name, username, email,password,role) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [user.name, user.username, user.email, hashedPassword, user.role]
    );
    return createdUser;
  } catch (err) {
    console.error("error creating user", err);
    throw err;
  }
};

module.exports = {
    getAllUsers,
    getOneUser,
    updateUser,
    createUser,
    deleteUser,
    authenticateUser
}
