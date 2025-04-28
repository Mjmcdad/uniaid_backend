const User = require("../Models/user");
const Student = require("../Models/student");
const EnrollmentPrice = require("../Models/enrollmentPrice");
const Subject = require('../Models/subject')
const SubjectOffer = require("../Models/subjectOffers")
const Enrollment = require('../Models/enrollment')
const { Op } = require('sequelize');
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const db = require('../config/dataBase')
const Transactions = require('../Models/transactions');
const DateNow = require("date/Date.now");

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
    console.log(error)

    res.status(500).json({ message: error.message });
  }
};


const get = async (req, res) => {
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
    console.log(error)

    res.status(500).json({ message: error.message });
  }
};

const index = async (req, res) => {
  try {


    const { academicYear, major, firstName, lastName, email, phoneNumber } = req.query;

    StudentQueryOptions = {}

    if (academicYear) {
      StudentQueryOptions.academicYear = academicYear;
    }
    if (major) {
      StudentQueryOptions.major = major;
    }

    const queryOptions = {
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "email", "phoneNumber"],
          where: {},
        },
      ],
      where: StudentQueryOptions,
    };


    if (firstName) {
      queryOptions.include[0].where.firstName = { [Op.like]: `${firstName}%` };
    }
    if (lastName) {
      queryOptions.include[0].where.lastName = { [Op.like]: `%${lastName}%` };
    }
    if (email) {
      queryOptions.include[0].where.email = { [Op.like]: `%${email}%` };
    }
    if (phoneNumber) {
      queryOptions.include[0].where.phoneNumber = { [Op.like]: `%${phoneNumber}%` };
    }

    const students = await Student.findAll(queryOptions);

    res.status(200).json(students);

  } catch (error) {
    console.log(error)

    res.status(500).json({ message: error.message });
  }
};


const createEnrollment = async (req, res) => {
  const { studentId, subjectOfferId, enrollmentDate, isQualified, status, group } = req.body;
  try {
    const student = await Student.findByPk(studentId);
    if (!student)
      throw new Error("student not found")

    const subject_offer = await SubjectOffer.findByPk(subjectOfferId);

    if (!subject_offer.isAvailable)
      throw new Error("this subject isn`t available");

    const subject = await Subject.findByPk(subject_offer.subjectId);

    if (subject.prerequisitesId) {
      const s = await Subject.findByPk(subject.prerequisitesId)
      const preq = await Enrollment.findOne({
        where: {
          studentId: student.id,
          status: 'passed',
        },
        include: [
          {
            model: SubjectOffer,
            where: {
              subjectId: subject.id
            }
          }
        ]
      })
      if (!preq)
        throw new Error(`you didnt meet the requirments , pass ${s.name} first`)

    }

    if (subject.academicYear > student.academicYear)
      throw new Error("this subject is for higher academic year")

    const enrollment_price = (await EnrollmentPrice.findByPk(student.enrollmentPriceId)).price

    if (student.balance < enrollment_price)
      throw new Error("the student doesn`t have enogh money")

    student.balance -= enrollment_price;

    const transaction = await Transactions.create({ subjectId: subject.id, studentId: studentId, amount: enrollment_price, transactionDate: DateNow() })

    if (!transaction)
      throw new Error("transaction didn`t happen")

    student.save();


    const enrollment = await Enrollment.create({ studentId, subjectOfferId, enrollmentDate, isQualified, status, group });

    res.status(201).json(enrollment);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const updateEnrollment = async (req, res) => {
  const { isQualified, status, group } = req.body; // Extract fields from request body
  const { id } = req.params; // Extract enrollment ID from request parameters

  try {

    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.isQualified = isQualified !== undefined ? isQualified : enrollment.isQualified;
    enrollment.status = status !== undefined ? status : enrollment.status;
    enrollment.group = group !== undefined ? group : enrollment.group;

    await enrollment.save();

    res.status(200).json({
      message: 'Enrollment updated successfully',
      data: enrollment,
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });

  }
};

const getEnrollments = async (req, res) => {
  const { id } = req.params
  try {
    const enrollments = await Enrollment.findAll({
      where: {
        studentId: id
      }
    })
    res.status(200).json(enrollments);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
}


module.exports = {
  createStudent,
  login,
  get,
  index,
  createEnrollment,
  updateEnrollment,
  getEnrollments
};
