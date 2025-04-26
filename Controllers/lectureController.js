const Lecture = require('../Models/lecture');
const Room = require('../Models/room');
const Subject = require('../Models/subject')
const { Op } = require('sequelize')


const create = async (req, res) => {
    try {
        const { roomId, subjectId, start_time, end_time, day } = req.body;

        const lecture = await Lecture.create({ roomId, subjectId, start_time, end_time, day });

        if (!lecture)
            throw new Error("there has been an error creating the lecture ")

        res.status(200).json(lecture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const index = async (req, res) => {
    try {
        const { roomId, day, subjectId, start_time, end_time } = req.query;

        const whereClause = {};

        if (roomId) {
            whereClause.roomId = roomId;
        }
        if (day) {
            whereClause.day = day;
        }
        if (subjectId) {
            whereClause.subjectId = subjectId;
        }
        if (start_time && end_time) {
            whereClause.start_time = {
                [Op.gte]: start_time, 
            };
            whereClause.end_time = {
                [Op.lte]: end_time, 
            };
        } else if (start_time) {
            whereClause.start_time = {
                [Op.gte]: start_time, 
            };
        } else if (end_time) {
            whereClause.end_time = {
                [Op.lte]: end_time, 
            };
        }

        const lectures = await Lecture.findAll({
            where: whereClause,
            include: [
                {
                    model: Room,
                },
                {
                    model: Subject,
                },
            ],
        });

        res.status(200).json(lectures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { index, create };
