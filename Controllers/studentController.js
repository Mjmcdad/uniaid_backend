const User = require('../Models/user');
const Student = require('../Models/student');
const EnrollmentPrice = require('../Models/enrollmentPrice');


const createStudent = async (req, res) => {
    const {firstName, lastName, enrollmentPriceId, email, password, phoneNumber, academicYear, enrollmentDate, major, balance} = req.body;
    try {
        const student = await Student.create({firstName, lastName, enrollmentPriceId, email, password, phoneNumber, academicYear, enrollmentDate, major, balance});
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateStudent = async (req, res) => {
    const {id} = req.params;
    const {firstName, lastName, enrollmentPriceId, email, password, phoneNumber, academicYear, enrollmentDate, major, balance} = req.body;
    try {
        const student = await Student.update({firstName, lastName, enrollmentPriceId, email, password, phoneNumber, academicYear, enrollmentDate, major, balance}, {where: {id}});
        res.status(200).json(student);
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
    const {id} = req.params;
    try {
        const student = await Student.findByPk(id);
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({message: error.message});
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
