const SubjectOffer = require('../Models/subjectOffers');
const Semester = require('../Models/semester');
const Subject = require('../Models/subject');



const updateSubjectOffer = async (req, res) => {
    const {id} = req.params;
    const {subjectId, semesterId, isAvailable} = req.body;
    try {
        const subjectOffer = await SubjectOffer.update({subjectId, semesterId, isAvailable}, {where: {id}});
        res.status(200).json(subjectOffer);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteSubjectOffer = async (req, res) => {
    const {id} = req.params;
    try {
        const subjectOffer = await SubjectOffer.destroy({where: {id}});
        res.status(200).json(subjectOffer);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getSubjectOfferBySemester = async (req, res) => {
    const {semesterId} = req.params;
    try {
        const subjectOffers = await SubjectOffer.findAll({where: {semesterId}});
        res.status(200).json(subjectOffers);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = { updateSubjectOffer, deleteSubjectOffer, getSubjectOfferBySemester};
