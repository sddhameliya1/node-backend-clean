const User = require("../models/user_auth_model");
const mongoose = require("mongoose");


// GET /api/admin/users?page=1&limit=10&search=&sortBy=createdAt&order=desc
const getAllUsersPaginated = async (req, res) => {
  try {
    // 1) Read query params (with defaults)
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 100);

    const search = (req.query.search || "").trim();
    const sortBy = req.query.sortBy || "createdAt"; // allowed: createdAt, name, email
    const order = (req.query.order || "desc").toLowerCase() === "asc" ? 1 : -1;

    // 2) Build filter
    const filter = {};
    if (search) {
      // search in name or email
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 3) Count total matching docs
    const total = await User.countDocuments(filter);

    // 4) Pagination math
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const skip = (page - 1) * limit;

    // 5) Fetch paginated data
    const users = await User.find(filter)
      .select("name email role createdAt") // never return password
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    // 6) Response (clean & standard)
    return res.status(200).json({
      message: "Users fetched Sucessfully!",
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: users,
    });
  } catch (error) {
    console.error("PAGINATION ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};




/**
 * GET /api/admin/users/cursor
 * Query params:
 * - limit=10
 * - cursor=<ObjectId>
 * - role=admin|user
 * - search=text
 */
const getUsersCursorPagination = async (req, res) => {
  try {
    // 1️⃣ Parse query params safely
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || "10", 10), 1),
      100
    );

    const cursor = req.query.cursor;
    const role = req.query.role;
    const search = req.query.search;

    // 2️⃣ Validate cursor
    if (cursor && !mongoose.Types.ObjectId.isValid(cursor)) {
      return res.status(400).json({
        message: "Invalid cursor value",
      });
    }

    // 3️⃣ Build filter object
    const filter = {};

    // Role filter
    if (role) {
      filter.role = role;
    }

    // Search filter (name OR email)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Cursor condition (must be AFTER filters)
    if (cursor) {
      filter._id = { $gt: cursor };
    }

    // 4️⃣ Query DB (limit + 1 trick)
    const users = await User.find(filter)
      .select("name email role createdAt")
      .sort({ _id: 1 })
      .limit(limit + 1);

    // 5️⃣ Pagination info
    let hasNextPage = false;
    let nextCursor = null;

    if (users.length > limit) {
      hasNextPage = true;
      const lastUser = users.pop();
      nextCursor = lastUser._id;
    }

    // 6️⃣ Response
    return res.status(200).json({
      message: "Users fetched successfully",
      data: users,
      pageInfo: {
        hasNextPage,
        nextCursor,
        limit,
      },
      filters: {
        role: role || null,
        search: search || null,
      },
    });
  } catch (error) {
    console.error("CURSOR + FILTER ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};




module.exports = { getAllUsersPaginated,getUsersCursorPagination};
