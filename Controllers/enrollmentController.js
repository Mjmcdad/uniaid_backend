const Enrollment = require('../Models/enrollment');
const Student = require('../Models/student');
const Semester = require('../Models/semester');
const Subject = require('../Models/subject');
const SubjectOffer = require('../Models/subjectOffers');
const { Op } = require('sequelize');



const updateEnrollment = async (req, res) => {
    const { id } = req.params;
    const { studentId, subjectOfferId, enrollmentDate, isQualified, status } = req.body;
    try {
        const enrollment = await Enrollment.update({ studentId, subjectOfferId, enrollmentDate, isQualified, status }, { where: { id } });
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEnrollment = async (req, res) => {
    const { id } = req.params;
    try {
        const enrollment = await Enrollment.destroy({ where: { id } });
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEnrollmentByStudentId = async (req, res) => {
    const { studentId } = req.params;
    try {
        const enrollments = await Enrollment.findAll({
            where: { studentId },
            include: [{
                model: SubjectOffer,
                include: [{
                    model: Subject,
                    attributes: ['name']
                }]
            }]
        });

        if (!enrollments.length) {
            return res.status(404).json({ message: 'No enrollments found for this student' });
        }

        const enrollmentData = enrollments.map(enrollment => ({
            ...enrollment.toJSON(),
            subjectName: enrollment.SubjectOffer.Subject.name
        }));

        res.status(200).json(enrollmentData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEnrollmentBySubjectOfferId = async (req, res) => {
    const { subjectOfferId } = req.params;
    try {
        const enrollment = await Enrollment.findAll({ where: { subjectOfferId } });
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEnrollmentBySemester = async (req, res) => {
    const { semesterId } = req.params;
    try {
        const enrollment = await Enrollment.findAll({
            include: [
                {
                    model: SubjectOffer,
                    where: { semesterId },
                    attributes: [],
                    include: [
                        {
                            model: Semester,
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUnenrolledSubjects = async (req, res) => {
    const { studentId } = req.params;
    try {

        const enrolledSubjects = await Enrollment.findAll({
            where: { studentId },
            include: [{
                model: SubjectOffer,
                include: [{
                    model: Subject,
                    attributes: ['id', 'name']
                }]
            }]
        });


        const enrolledSubjectIds = enrolledSubjects.map(enrollment => enrollment.SubjectOffer.Subject.id);


        const unenrolledSubjects = await Subject.findAll({
            where: {
                id: { [Op.notIn]: enrolledSubjectIds }
            },
            attributes: ['id', 'name']
        });


        if (!unenrolledSubjects.length) {
            return res.status(404).json({ message: 'Student is enrolled in all available subjects' });
        }


        res.status(200).json(unenrolledSubjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { updateEnrollment, deleteEnrollment, getEnrollmentByStudentId, getEnrollmentBySubjectOfferId, getEnrollmentBySemester, getUnenrolledSubjects };
