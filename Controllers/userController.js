const User = require("../Models/user");
const Student = require("../Models/student");
const Teacher = require("../Models/teacher");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsersByRole = async (req, res) => {
  const { role } = req.params;
  try {
    const users = await User.findAll({ where: { role } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    if (role === "student") {
      await Student.create({ userId: User.id, firstName, lastName, email });
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, phoneNumber, role } = req.body;
  try {
    const user = await User.update(
      { firstName, lastName, email, password, phoneNumber, role },
      { where: { id } }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.destroy({ where: { id } });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getAllUsers,
  getUsersByRole,
  createUser,
  updateUser,
  deleteUser,
};
