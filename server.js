const express = require("express");

const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(requestLogger);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/", authRoutes);
app.use("/", userRoutes);

const PORT = 3000;

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

  res.status(500).json({
    error: "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
