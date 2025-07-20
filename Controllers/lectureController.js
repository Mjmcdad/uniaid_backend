const Lecture = require("../Models/lecture");
const Room = require("../Models/room");
const Subject = require("../Models/subject");
const { Op } = require("sequelize");
const Teacher = require("../Models/teacher");
const User = require("../Models/user");
const sequelize = require("sequelize");

const create = async (req, res) => {
  try {
    const { roomId, subjectId, teacherId, start_time, end_time, day, groups } =
      req.body;

    const lecture = await Lecture.create({
      roomId,
      teacherId,
      subjectId,
      start_time,
      end_time,
      day,
      groups,
    });

    if (!lecture)
      throw new Error("there has been an error creating the lecture ");

    res.status(200).json(lecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const index = async (req, res) => {
  try {
    const { roomId, day, start_time, end_time, group, teacher, subject } =
      req.query;

    const whereClause = {};
    const teacherWhere = {};
    const subjectWhere = {};

    // Add filters based on query parameters
    if (roomId) {
      whereClause.roomId = roomId;
    }
    if (day) {
      whereClause.day = day;
    }

    if (teacher) {
      teacherWhere.firstName = { [Op.like]: `%${teacher}%` };
    }

    if (subject) {
      subjectWhere.name = { [Op.like]: `%${subject}%` }; // Find where firstName ≠ teacher
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
        sequelize.fn(
          "JSON_CONTAINS",
          sequelize.col("groups"),
          sequelize.literal(`'${group}'`)
        ),
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
          required: true,
          where: subjectWhere,
        },
        {
          model: Teacher,
          required: true,
          attributes: ["id"],
          include: [
            {
              model: User,
              attributes: ["id", "firstName", "lastName"],
              where: teacherWhere,
              required: true,
            },
          ],
        },
      ],
      order: [["start_time", "ASC"]],
    });

    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get = async (req, res) => {
  try {
    const { id } = req.params;
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
          attributes: ["id"],
          include: [
            {
              model: User,
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
      ],
    });

    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId, subjectId, teacherId, start_time, end_time, day, groups } =
      req.body;

    const lecture = await Lecture.findByPk(id);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (start_time || end_time) {
      const newStart = start_time || lecture.start_time;
      const newEnd = end_time || lecture.end_time;
      const newDay = day || lecture.day;
      const newRoomId = roomId || lecture.roomId;

      const conflictingLecture = await Lecture.findOne({
        where: {
          id: { [Op.ne]: id },
          roomId: newRoomId,
          day: newDay,
          [Op.or]: [
            {
              start_time: { [Op.lt]: newEnd },
              end_time: { [Op.gt]: newStart },
            },
          ],
        },
      });

      if (conflictingLecture) {
        return res.status(400).json({
          message: "Time conflict with another lecture in the same room",
        });
      }

      const teacherConflict = await Lecture.findOne({
        where: {
          id: { [Op.ne]: id },
          teacherId: teacherId || lecture.teacherId,
          day: newDay,
          [Op.or]: [
            {
              start_time: { [Op.lt]: newEnd },
              end_time: { [Op.gt]: newStart },
            },
          ],
        },
      });

      if (teacherConflict) {
        return res.status(400).json({
          message: "The teacher has another lecture at this time",
        });
      }
    }

    // Update the lecture
    const updatedLecture = await lecture.update({
      roomId,
      subjectId,
      teacherId,
      start_time,
      end_time,
      day,
      groups,
    });

    res.status(200).json(updatedLecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { index, create, get, update };
