const Enrollment = require('../Models/enrollment');
const Student = require('../Models/student');
const Semester = require('../Models/semester');
const Subject = require('../Models/subject');
const SubjectOffer = require('../Models/subjectOffers');

const createEnrollment = async (req, res) => {
    const {studentId, subjectOfferId, enrollmentDate, isQualified, status} = req.body;
    try {
        const enrollment = await Enrollment.create({studentId, subjectOfferId, enrollmentDate, isQualified, status});
        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateEnrollment = async (req, res) => {
    const {id} = req.params;
    const {studentId, subjectOfferId, enrollmentDate, isQualified, status} = req.body;
    try {
        const enrollment = await Enrollment.update({studentId, subjectOfferId, enrollmentDate, isQualified, status}, {where: {id}});
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteEnrollment = async (req, res) => {
    const {id} = req.params;
    try {
        const enrollment = await Enrollment.destroy({where: {id}});
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getEnrollmentByStudentId = async (req, res) => {
    const {studentId} = req.params;
    try {
        const enrollment = await Enrollment.findAll({where: {studentId}});
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getEnrollmentBySubjectOfferId = async (req, res) => {
    const {subjectOfferId} = req.params;
    try {
        const enrollment = await Enrollment.findAll({where: {subjectOfferId}});
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getEnrollmentBySemester = async (req, res) => {
    const {semesterId} = req.params;
    try {
        const enrollment = await Enrollment.findAll({
            include: [
                {model: SubjectOffer,
                     where: {semesterId},
                     attributes: [],
                     include: [
                        {model: Semester,
                             attributes: ['id','name']}
                     ]
                    }
            ]
        });
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};



module.exports = {createEnrollment, updateEnrollment, deleteEnrollment, getEnrollmentByStudentId, getEnrollmentBySubjectOfferId, getEnrollmentBySemester};
