const jwt = require("jsonwebtoken");
const User = require("../models/user_auth_model");

// PROTECT ROUTES
const protect = async (req, res, next) => {
    try {
        let token;

        // 1️⃣ Check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, token missing",
            });
        }

        // 2️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3️⃣ Get user from token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "Not authorized, user not found",
            });
        }
        console.log("AUTH HEADER:", req.headers.authorization);
        console.log("MIDDLEWARE JWT SECRET:", process.env.JWT_SECRET);

        // 4️⃣ Attach user to request
        req.user = user;

        next(); // allow request
    } catch (error) {
        console.error("JWT VERIFY ERROR:", error.message);
        return res.status(401).json({
            message: "Not authorized, invalid token",
        });
    }

};

module.exports = { protect };
