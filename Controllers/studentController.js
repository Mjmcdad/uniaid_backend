const User = require("../Models/user");
const Student = require("../Models/student");
const EnrollmentPrice = require("../Models/enrollmentPrice");
const Subject = require('../Models/subject')
const SubjectOffer = require("../Models/subjectOffers")
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const db = require('../config/dataBase')


const createStudent = async (req, res) => {
  const {
    firstName,
    lastName,
    enrollmentPriceId,
    socialNumber,
    email,
    password,
    phoneNumber,
    enrollmentDate,
    major,
    balance,
  } = req.body;

  // Start a transaction
  const t = await db.transaction()

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hashSync(password);

    // Create the user within the transaction
    const user = await User.create(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        role: "student",
      },
      { transaction: t } // Pass the transaction here
    );

    if (!user) throw new Error("User isn't created");

    // Create the student within the same transaction
    const student = await Student.create(
      {
        enrollmentPriceId,
        socialNumber,
        enrollmentDate,
        major,
        balance,
        userId: user.id,
      },
      { transaction: t } // Pass the transaction here
    );

    if (!student) throw new Error("Student isn't created");

    // Commit the transaction if everything is successful
    await t.commit();

    // Respond with success
    res.status(201).json({ student: student, user: user });
  } catch (error) {
    // Rollback the transaction in case of an error
    await t.rollback();

    // Respond with the error message
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

    const isPasswordValid = bcrypt.compareSync(
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

const createEnrollment = async (req, res) => {
  const { studentId, subjectOfferId, enrollmentDate, isQualified, status } = req.body;
  try {
    const student = await Student.findByPk(studentId);
    const subject_offer = await SubjectOffer.findByPk(subjectOfferId);
    if (!subject_offer.isAvailable)
      throw new Error("this subject isn`t available");

    const subject = await Subject.findByPk(subject_offer.subjectId);

    if (subject.academicYear > student.academicYear)
      throw new Error("this subject is for higher academic year")

    const enrollment_price = (await EnrollmentPrice.findByPk(student.enrollmentPriceId)).price
    if (student.balance < enrollment_price)
      throw new Error("the student doesn`t have enogh money")

    const enrollment = await Enrollment.create({ studentId, subjectOfferId, enrollmentDate, isQualified, status });

    res.status(201).json(enrollment);
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

module.exports = {
  createStudent,
  login,
  createEnrollment,
  updateStudent,
  deleteStudent,
  getStudentByName,
  getStudentById,
  getAllStudents,
};
