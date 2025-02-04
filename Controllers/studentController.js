const User = require('../Models/user');
const Student = require('../Models/student');
const EnrollmentPrice = require('../Models/enrollmentPrice');
const bcrypt = require('bcrypt');


const createStudent = async (req, res) => {
    const {firstName, lastName, enrollmentPriceId, email, password, phoneNumber, academicYear, enrollmentDate, major, balance} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            role: 'student'
        });

        const student = await Student.create({
            firstName,
            lastName,
            enrollmentPriceId,
            email,
            phoneNumber,
            academicYear,
            enrollmentDate,
            major,
            balance,
            userId: user.id
        });

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({message: error.message});
    }

};

const updateStudent = async (req, res) => {
    const {id} = req.params;
    const {firstName, lastName, enrollmentPriceId, email, password, phoneNumber, academicYear, enrollmentDate, major, balance} = req.body;
    try {
        const [updated] = await Student.update(
            {firstName, lastName, enrollmentPriceId, email, password, phoneNumber, academicYear, enrollmentDate, major, balance},
            {where: {id}}
        );

        if (updated) {
            const updatedStudent = await Student.findByPk(id);
            res.status(200).json(updatedStudent);
        } else {
            res.status(404).json({message: "Student not found"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteStudent = async (req, res) => {
    const {id} = req.params;
    try {
        const student = await Student.destroy({where: {id}});
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getStudentByName = async (req, res) => {
    const {firstName, lastName} = req.params;
    try {
        const student = await Student.findAll({where: {firstName, lastName}});
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findByPk(id, {
            include: [{
                model: User,
                attributes: ['firstName', 'lastName'] 
            }]
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const studentData = {
            ...student.toJSON(),
            firstName: student.User.firstName,
            lastName: student.User.lastName
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
        res.status(500).json({message: error.message});
    }
};

module.exports = {createStudent, updateStudent, deleteStudent, getStudentByName, getStudentById, getAllStudents};
