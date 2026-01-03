const User = require("../models/user_model");

// CREATE: POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Basic validation
    if (!name || !email || age === undefined) {
      return res.status(400).json({ message: "name, email, age are required" });
    }

    // Check duplicate email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({ name, email, age });

    return res.status(201).json({
      message: "User created",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update User By ID 

// UPDATE: PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    // 1. Check if ID exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. If email is being updated, check duplicate
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    // 3. Update only provided fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (age !== undefined) user.age = age;

    // 4. Save updated user
    const updatedUser = await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete user By Id

// DELETE: DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find user by ID
    const user = await User.findById(id);

    // 2. If user does not exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Delete user
    await user.deleteOne();

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all User

// GET ALL USERS: GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET USER BY ID: GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Invalid user ID or server error",
    });
  }
};




module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById
};
