const Semester = require('../Models/semester');
const Subject = require('../Models/subject');
const SubjectOffer = require('../Models/subjectOffers')
const { Op } = require('sequelize');

const create = async (req, res) => {
  const { year, term, startDate, endDate } = req.body;
  try {
    const semester = await Semester.create({ year, term, startDate, endDate });
    res.status(201).json(semester);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateSemester = async (req, res) => {
  const { id } = req.params;
  const { year, term, startDate, endDate } = req.body;
  try {
    const semester = await Semester.update({ year, term, startDate, endDate }, { where: { id } });
    res.status(200).json(semester);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSemester = async (req, res) => {
  const { id } = req.params;
  try {
    const semester = await Semester.destroy({ where: { id } });
    res.status(200).json(semester);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get = async (req, res) => {
  const { id } = req.params;
  try {
    const semester = await Semester.findByPk(id,
      {
        include: [{
          model: SubjectOffer,
          include: Subject
        }
        ]
      });
    res.status(200).json(semester);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const index = async (req, res) => {
  try {

    const { year, term } = req.query;


    const queryOptions = {
      where: {},
      include: [
        {
          model: SubjectOffer,
          include: Subject,
        },
      ],
    };


    if (year) {
      queryOptions.where.year = year;
    }
    if (term) {
      queryOptions.where.term = term;
    }

    const semesters = await Semester.findAll(queryOptions);

    res.status(200).json(semesters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createSubjectOffer = async (req, res) => {
  const { subjectId, isAvailable } = req.body;
  const { id } = req.params
  try {
    const subjectOffer = await SubjectOffer.create({ subjectId, semesterId: id, isAvailable });
    res.status(201).json(subjectOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { create, updateSemester, deleteSemester, get, index, createSubjectOffer };
