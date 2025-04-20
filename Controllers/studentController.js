const User = require("../Models/user");
const Student = require("../Models/student");
const EnrollmentPrice = require("../Models/enrollmentPrice");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

const createStudent = async (req, res) => {
  const {
    firstName,
    lastName,
    enrollmentPriceId,
    socialNumber,
    hoursAchieved,
    gpa,
    email,
    password,
    phoneNumber,
    academicYear,
    enrollmentDate,
    major,
    balance,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hashSync(password);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role: "student",
    });

    if (!user) throw new Error("user isn`t created");

    const student = await Student.create({
      enrollmentPriceId,
      socialNumber,
      hoursAchieved,
      gpa,
      academicYear,
      enrollmentDate,
      major,
      balance,
      userId: user.id,
    });
    if (!student) throw new Error("student isn`t created");

    res.status(201).json({ student: student, user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    enrollmentPriceId,
    socialNumber,
    hoursAchieved,
    gpa,
    email,
    password,
    phoneNumber,
    academicYear,
    enrollmentDate,
    major,
    balance,
  } = req.body;
  try {
    const [updated] = await Student.update(
      {
        firstName,
        lastName,
        enrollmentPriceId,
        socialNumber,
        hoursAchieved,
        gpa,
        email,
        password,
        phoneNumber,
        academicYear,
        enrollmentDate,
        major,
        balance,
      },
      { where: { id } }
    );

    if (updated) {
      const updatedStudent = await Student.findByPk(id);
      res.status(200).json(updatedStudent);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.destroy({ where: { id } });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentByName = async (req, res) => {
  const { firstName, lastName } = req.params;
  try {
    const student = await Student.findAll({ where: { firstName, lastName } });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "email", "phoneNumber"],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentData = {
      ...student.toJSON(),
      firstName: student.User.firstName,
      lastName: student.User.lastName,
      email: student.User.email,
      phoneNumber: student.User.phoneNumber,
    };

    res.status(200).json(studentData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { id, password } = req.body;
  try {
    const student = await Student.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["password", "role"],
        },
      ],
    });

    if (!student || !student.User) {
      console.log("Student not found");
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      student.User.password
    );

    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    const token = jwt.sign(
      { id: student.id, role: student.User.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByName,
  getStudentById,
  getAllStudents,
  login,
};
