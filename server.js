const express = require("express");

const app = express();

const SECRET_KEY = "abcd_1234";

const jwt = require("jsonwebtoken");

app.use(requestLogger);

app.use(express.json());

let users = [
  {
    id: 1,
    name: "Alice",
    username: "admin",
    password: "password123",
  },
  {
    id: 2,
    name: "Bob",
    username: "student",
    password: "learn2code",
  },
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

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Access denied. No token provided.",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decodedData) => {
    if (err) {
      return res.status(403).json({
        error: "Invalid or expired token.",
      });
    }

    req.user = decodedData;
    next();
  });
}

app.get("/", (req, res) => {
  res.send("Welcome to the User Directory API");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (user) => user.username === username && user.password === password,
  );

  if (!user) {
    return res.status(401).json({
      error: "Invalid username or password",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1h",
  });

  res.status(200).json({
    message: "Login successful",
    token: token,
  });
});

app.get("/users", authenticateToken, (req, res) => {
  res.status(200).json({
    message: `Welcome, ${req.user.username}!`,
    user: {
      id: req.user.id,
      username: req.user.username,
    },
  });
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
