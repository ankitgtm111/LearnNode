const { users } = require("../models/userModel");

function getHome(req, res) {
  res.send("Welcome to the User Directory API");
}

function getUsers(req, res) {
  res.status(200).json({
    message: `Welcome, ${req.user.username}!`,
    user: {
      id: req.user.id,
      username: req.user.username,
    },
  });
}

function getUserById(req, res) {
  const id = parseInt(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  res.json(user);
}

function createUser(req, res) {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
  };

  users.push(newUser);
  res.status(201).json(newUser);
}

module.exports = {
  getHome,
  getUsers,
  getUserById,
  createUser,
};
