const User = require("../Models/user");
const Student = require("../Models/student");
const EnrollmentPrice = require("../Models/enrollmentPrice");
const Subject = require("../Models/subject");
const SubjectOffer = require("../Models/subjectOffers");
const Enrollment = require("../Models/enrollment");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const db = require("../config/dataBase");
const sequelize = require("sequelize");
const Transactions = require("../Models/transactions");
const DateNow = require("date/Date.now");
const Semester = require("../Models/semester");
const StudentMark = require("../Models/studentMark");
const OTP = require("../Models/otp");
const { sendOTPEmail } = require("../utils/email.service");

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
  const t = await db.transaction();

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

const updateStudent = async (req, res) => {
  const { major, balance } = req.body;

  const { id } = req.params;

  // Start a transaction
  const t = await db.transaction();

  try {
    // Find the student within the transaction
    const student = await Student.findByPk(id, { transaction: t });

    if (!student) {
      throw new Error("Student not found");
    }

    // Update the student data
    const updatedStudent = await student.update(
      {
        major: major || student.major,
        balance: balance || student.balance,
      },
      { transaction: t }
    );

    // Commit the transaction if everything is successful
    await t.commit();

    // Respond with success
    res.status(200).json({ student: updatedStudent });
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

    const isPasswordValid = bcrypt.compareSync(password, student.User.password);

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
    console.log(error);

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
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

const index = async (req, res) => {
  try {
    const { academicYear, major, firstName, lastName, email, phoneNumber } =
      req.query;

    StudentQueryOptions = {};

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
      queryOptions.include[0].where.phoneNumber = {
        [Op.like]: `%${phoneNumber}%`,
      };
    }

    const students = await Student.findAll(queryOptions);

    res.status(200).json(students);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

const createEnrollment = async (req, res) => {
  const {
    studentId,
    subjectOfferId,
    enrollmentDate,
    isQualified,
    status,
    group,
  } = req.body;
  try {
    const student = await Student.findByPk(studentId);
    if (!student) throw new Error("student not found");

    const subject_offer = await SubjectOffer.findByPk(subjectOfferId);

    if (!subject_offer.isAvailable)
      throw new Error("this subject isn`t available");

    const subject = await Subject.findByPk(subject_offer.subjectId);

    if (subject.prerequisitesId) {
      const s = await Subject.findByPk(subject.prerequisitesId);
      const preq = await Enrollment.findOne({
        where: {
          studentId: student.id,
          status: "passed",
        },
        include: [
          {
            model: SubjectOffer,
            where: {
              subjectId: subject.id,
            },
          },
        ],
      });
      if (!preq)
        throw new Error(
          `you didnt meet the requirments , pass ${s.name} first`
        );
    }

    if (subject.academicYear > student.academicYear)
      throw new Error("this subject is for higher academic year");

    const enrollment_price = (
      await EnrollmentPrice.findByPk(student.enrollmentPriceId)
    ).price;

    if (student.balance < enrollment_price)
      throw new Error("the student doesn`t have enogh money");

    student.balance -= enrollment_price;

    const transaction = await Transactions.create({
      subjectId: subject.id,
      studentId: studentId,
      amount: enrollment_price,
      transactionDate: DateNow(),
    });

    if (!transaction) throw new Error("transaction didn`t happen");

    student.save();

    const enrollment = await Enrollment.create({
      studentId,
      subjectOfferId,
      enrollmentDate,
      isQualified,
      status,
      group,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateEnrollment = async (req, res) => {
  const { isQualified, status, group } = req.body; // Extract fields from request body
  const { id } = req.params; // Extract enrollment ID from request parameters

  try {
    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    enrollment.isQualified =
      isQualified !== undefined ? isQualified : enrollment.isQualified;
    enrollment.status = status !== undefined ? status : enrollment.status;
    enrollment.group = group !== undefined ? group : enrollment.group;

    await enrollment.save();

    res.status(200).json({
      message: "Enrollment updated successfully",
      data: enrollment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getEnrollments = async (req, res) => {
  const { id } = req.params;
  try {
    const enrollments = await Enrollment.findAll({
      where: {
        studentId: id,
      },
    });
    res.status(200).json(enrollments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getAcadamicLife = async (req, res) => {
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

    const enrollmentYear = new Date(student.enrollmentDate).getFullYear();

    const semesters = await Semester.findAll({
      where: {
        year: {
          [sequelize.Op.gte]: enrollmentYear,
        },
      },
      include: [
        {
          model: SubjectOffer,
          include: [
            {
              model: Enrollment,
              where: {
                studentId: id,
              },
              include: [{ model: StudentMark }],
            },
            {
              model: Subject,
            },
          ],
        },
      ],
      order: [["startDate", "ASC"]],
    });

    // Process each semester and collect GPA data
    const processedSemesters = semesters.map((semester) => {
      let totalWeightedScore = 0;
      let totalHours = 0;

      semester.SubjectOffers.forEach((subjectOffer) => {
        const enrollment = subjectOffer.Enrollments[0]; // assuming one enrollment per subject
        const studentMark = enrollment?.StudentMark;
        const subject = subjectOffer.Subject;

        if (studentMark && subject) {
          const totalMark = studentMark.totalMark;
          const hours = subject.hours;

          totalWeightedScore += totalMark * hours;
          totalHours += hours;
        }
      });

      const semesterGpa = totalHours > 0 ? totalWeightedScore / totalHours : 0;

      return {
        ...semester.toJSON(),
        gpa: semesterGpa.toFixed(2),
      };
    });

    // Get the most recent semester (last one after sorting by startDate)
    const latestSemester = processedSemesters[processedSemesters.length - 1];

    if (latestSemester && latestSemester.gpa) {
      // Update the student's GPA with the GPA from the latest semester
      await student.update({ gpa: parseFloat(latestSemester.gpa) });
    }

    const studentData = {
      studentInfo: student,
      semesters: processedSemesters,
    };

    res.status(200).json(studentData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create OTP record
    await OTP.create({
      email,
      otp: otpCode,
      expiresAt,
      used: false,
    });

    // Send OTP email
    await sendOTPEmail(email, otpCode);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

const verifyOTPAndResetPassword = async (req, res) => {
  const t = await db.transaction();
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Email, OTP and new password are required" });
    }

    // Find the most recent valid OTP
    const otpRecord = await OTP.findOne({
      where: {
        email,
        used: false,
        expiresAt: { [Op.gt]: new Date() }, // Not expired
      },
      order: [["createdAt", "DESC"]],
      transaction: t,
      lock: t.LOCK.UPDATE, // Lock the row for update
    });

    if (!otpRecord) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Find user
    const user = await User.findOne({
      where: { email },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hashSync(newPassword);
    console.log(hashedPassword);

    // Update user password
    await user.update({ password: hashedPassword }, { transaction: t });

    // Mark OTP as used
    await otpRecord.update({ used: true }, { transaction: t });

    // Commit transaction
    await t.commit();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    // Rollback transaction if any error occurs
    if (t && !t.finished) {
      await t.rollback();
    }

    console.error("Error in verifyOTPAndResetPassword:", error);

    return res.status(500).json({
      message: "Failed to reset password",
      error: error.message,
    });
  }
};

module.exports = {
  createStudent,
  login,
  get,
  index,
  createEnrollment,
  updateEnrollment,
  getEnrollments,
  getAcadamicLife,
  updateStudent,
  requestPasswordReset,
  verifyOTPAndResetPassword,
};
