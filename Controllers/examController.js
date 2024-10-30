const Exam = require('../Models/exam');
const SubjectOffer = require('../Models/subjectOffer');

const createExam = async (req, res) => {
    const {subjectOfferId, type, date, duration} = req.body;
    try {
        const exam = await Exam.create({subjectOfferId, type, date, duration});
        res.status(201).json(exam);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateExam = async (req, res) => {
    const {id} = req.params;
    const {subjectOfferId, type, date, duration} = req.body;
    try {
        const exam = await Exam.update({subjectOfferId, type, date, duration}, {where: {id}});
        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteExam = async (req, res) => {
    const {id} = req.params;
    try {
        const exam = await Exam.destroy({where: {id}});
        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {createExam, updateExam, deleteExam};
