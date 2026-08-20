const jwt = require("jsonwebtoken");
const { users } = require("../models/userModel");

function getLoginPage(req, res) {
  res.render("login");
}

function loginUser(req, res) {
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

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({
    message: "Login successful",
    token: token,
  });
}

module.exports = {
  getLoginPage,
  loginUser,
};
