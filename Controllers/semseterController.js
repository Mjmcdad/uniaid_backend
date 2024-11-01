const Semester = require('../Models/semester');

const createSemester = async (req, res) => {
    const {year, term, startDate, endDate} = req.body;
    try{
        const semester = await Semester.create({year, term ,startDate, endDate});
        res.status(201).json(semester);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateSemester = async (req, res) => {
    const {id} = req.params;
    const {year, term, startDate, endDate} = req.body;
    try {
        const semester = await Semester.update({year, term, startDate, endDate}, {where: {id}});
        res.status(200).json(semester);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteSemester = async (req, res) => {
    const {id} = req.params;
    try {
        const semester = await Semester.destroy({where: {id}});
        res.status(200).json(semester);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getSemester = async (req, res) => {
    const {id} = req.params;
    try {
        const semester = await Semester.findByPk(id);
        res.status(200).json(semester);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};



module.exports = {createSemester, updateSemester, deleteSemester, getSemester};
