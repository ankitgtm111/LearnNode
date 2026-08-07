const express = require("express");

const app = express();

app.use(requestLogger);

app.use(express.json());

let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const PORT = 3000;

function requestLogger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

function validateUser(req, res, next) {
  if (!req.body || !req.body.name) {
    return res.status(400).json({
      error: "Name is required",
    });
  }
  next();
}

app.get("/", (req, res) => {
  res.send("Welcome to the User Directory API");
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }
  res.json(user);
});

app.post("/users", validateUser, (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// 500 - Generic server error
app.use((err, req, res, next) => {
  //console.error(err);

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
