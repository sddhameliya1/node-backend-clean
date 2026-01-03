const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You are not authorized.",
      });
    }
    next();
  };
};

module.exports = { authorize };
