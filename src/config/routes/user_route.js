const express = require("express");

const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
} = require("../controllers/user_controller");

const router = express.Router();

router.post("/users", createUser);  // create User
router.put("/UpdateUserById/:id",updateUser); // Update User By ID
router.delete("/DeleteUserById/:id",deleteUser)
router.get("/GetAllUser",getAllUsers)
router.get("/GetUserById/:id",getUserById)

module.exports = router;