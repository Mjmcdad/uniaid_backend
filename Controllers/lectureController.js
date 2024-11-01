const Lecture = require('../Models/lecture');
const SubjectOffer = require('../Models/subjectOffer');
const Room = require('../Models/room');

const createLecture = async (req, res) => {
    const {subjectOfferId, roomId, lectureDate} = req.body;
    try {
        const lecture = await Lecture.create({subjectOfferId, roomId, lectureDate});
        res.status(201).json(lecture);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateLecture = async (req, res) => {
    const {id} = req.params;
    const {subjectOfferId, roomId, lectureDate} = req.body;
    try {
        const lecture = await Lecture.update({subjectOfferId, roomId, lectureDate}, {where: {id}});
        res.status(200).json(lecture);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};  

const deleteLecture = async (req, res) => {
    const {id} = req.params;
    try {
        const lecture = await Lecture.destroy({where: {id}});
        res.status(200).json(lecture);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {createLecture, updateLecture, deleteLecture};
