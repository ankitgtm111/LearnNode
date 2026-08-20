require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const { globalLimiter } = require("./middleware/rateLimiters");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const sanitizeInput = require("./middleware/sanitizeInput");

const app = express();
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }

  next();
});

app.use(helmet());
app.use(globalLimiter);

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(requestLogger);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(sanitizeInput);

app.use("/", authRoutes);
app.use("/", userRoutes);

const PORT = process.env.PORT || 3000;

function requestLogger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

// 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// 500 - Generic server error
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON",
    });
  }

  if (err.status === 413 || err.type === "entity.too.large") {
    return res.status(413).json({
      error: "Payload Too Large",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
