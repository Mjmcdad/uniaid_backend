const User = require("../Models/user");
const Admin = require("../Models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");


const createAdmin = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;
  try {
    const hashedPassword = await bcrypt.hashSync(password);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role: "Admin",
    });

    if (!user) throw new Error("User isn`t created");

    const admin = await Admin.create({ userId: user.id });
    if (!admin) throw new Error("Admin isn`t created");

    res.status(201).json({ user: user, admin: admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, role: "admin" } });
    if (!user) {
      console.log("Admin not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAdmin,
  adminLogin,

};
