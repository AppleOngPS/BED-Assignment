const sql = require("mssql");
const User = require("../models/users");

const createUser = async (req, res) => {
  try {
    const { name, password, email, contactNumber, age, height, weight, weightGoal, TargetCalarieIntake } = req.body;
    const newUser = await User.createUserAccount({ name, password, email, contactNumber, age, height, weight, weightGoal, TargetCalarieIntake });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).send("Error retrieving users");
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.getUserById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
};

const searchUsers = async (req, res) => {
  const searchTerm = req.query.searchTerm;
  try {
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Error searching users" });
  }
};

const loginUser = async (req, res) => {
  const { name, password } = req.query;
  try {
    const user = await User.getUserByNameAndPassword(name, password);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserByName = async (req, res) => {
  const { name } = req.query;
  try {
    const user = await User.getUserByName(name); // Implement this method in your User model

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user by name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  searchUsers,
  loginUser,
  getUserByName,
};