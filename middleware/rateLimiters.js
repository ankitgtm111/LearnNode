const { rateLimit } = require("express-rate-limit");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    error: "Too many requests, please try again later.",
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  message: {
    error: "Too many login attempts, please try again later.",
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

module.exports = {
  globalLimiter,
  loginLimiter,
};
