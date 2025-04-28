const Lecture = require('../Models/lecture');
const Room = require('../Models/room');
const Subject = require('../Models/subject')
const { Op } = require('sequelize');
const Teacher = require('../Models/teacher');
const User = require('../Models/user');
const sequelize = require('sequelize')


const create = async (req, res) => {
    try {
        const { roomId, subjectId, teacherId, start_time, end_time, day, groups } = req.body;

        const lecture = await Lecture.create({ roomId, teacherId, subjectId, start_time, end_time, day, groups });

        if (!lecture)
            throw new Error("there has been an error creating the lecture ")

        res.status(200).json(lecture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const index = async (req, res) => {
    try {
        const { roomId, day, subjectId, start_time, end_time, group } = req.query;

        const whereClause = {};

        // Add filters based on query parameters
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

        if (group) {
            whereClause.groups = sequelize.where(
                sequelize.fn('JSON_CONTAINS', sequelize.col('groups'), sequelize.literal(`'${group}'`)),
                true
            );
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
                {
                    model: Teacher,
                    attributes: ['id'],
                    include: [{
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }]
                },
            ],
        });

        res.status(200).json(lectures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const get = async (req, res) => {
    try {
        const { id } = req.params
        const lectures = await Lecture.findByPk(id, {
            include: [
                {
                    model: Room,
                },
                {
                    model: Subject,
                },
                {
                    model: Teacher,
                    attributes: ['id'],
                    include: [{
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }]
                },
            ],
        });

        res.status(200).json(lectures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { index, create, get };
