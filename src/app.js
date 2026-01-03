const express = require("express");

const userRoutes = require("./config/routes/user_route");
const authRoutes = require("./config/routes/user_auth_route");
const adminRoutes = require("./config/routes/admin_route");
const { apiLimiter } = require("./config/middlewares/rate_limit_middlewares");

const app = express();

app.use(express.json());

// Rate limit normal APIs
app.use("/apiLimiter", apiLimiter);

//Routes
app.use("/api", userRoutes);
app.use("/apiauth", authRoutes);  
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
