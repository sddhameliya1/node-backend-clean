const express = require("express");
const { protect } = require("../middlewares/auth_middlewares");
const { authorize } = require("../middlewares/role_middlewares");
const { getAllUsersPaginated,getUsersCursorPagination } = require("../controllers/admin_controller");

const router = express.Router();

router.get(
  "/all-users",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin. You can see all users.",
    });
  }
);

// GET /api/admin/users?page=1&limit=10
router.get(
  "/users/cursor",
  protect,
  authorize("admin"),
  getUsersCursorPagination
);


module.exports = router;