const Teacher = require('../Models/teacher');
const Tsection = require('../Models/tSection');
const Psection = require('../Models/pSection');
const Tteacher = require('../Models/tTeacher');
const Pteacher = require('../Models/pTeacher')
const Subject = require('../Models/subject');

const createTeacher = async (req, res) => { 
    const {firstName, lastName, email, password, phoneNumber} = req.body;
    try { 
        const teacher = await Teacher.create({firstName, lastName, email, password, phoneNumber});
        res.status(201).json(teacher);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateTeacher = async (req, res) => {
    const {id} = req.params;
    const {firstName, lastName, email, password, phoneNumber} = req.body;
    try {
        const teacher = await Teacher.update({firstName, lastName, email, password, phoneNumber}, {where: {id}});
        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteTeacher = async (req, res) => {
    const {id} = req.params;
    try {
        const teacher = await Teacher.destroy({where: {id}});
        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getTeacherByName = async (req, res) => {
    const {firstName, lastName} = req.params;
    try {
        const teacher = await Teacher.findAll({where: {firstName, lastName}});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};  

const getTeacherById = async (req, res) => {
    const {id} = req.params;
    try {
        const teacher = await Teacher.findByPk(id);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


const createTteacher = async (req, res) => {
    const {teacherId, tSectionId} = req.body;
    try {
        const tTeacher = await Tteacher.create({teacherId, tSectionId});
        res.status(201).json(tTeacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPteacher = async (req, res) => {
    const {teacherId, pSectionId} = req.body;
    try{
        const pTeacher = await Pteacher.create({teacherId, pSectionId});
        res.status(201).json(pTeacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {createTeacher, updateTeacher, deleteTeacher, getTeacherByName, getTeacherById, getAllTeachers, createTteacher, createPteacher};
