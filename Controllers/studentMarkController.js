const StudentMark = require('../Models/studentMark');

const createStudentMark = async (req, res) => {
    const {enrollmentId, finalMark, midtermMark, practicalMark, assignmentMark, totalMark} = req.body;
    try {
        const studentMark = await StudentMark.create({enrollmentId, finalMark, midtermMark, practicalMark, assignmentMark, totalMark});
        res.status(201).json(studentMark);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}; 

const updateStudentMark = async (req, res) => {
    const {id} = req.params;
    const {enrollmentId, finalMark, midtermMark, practicalMark, assignmentMark, totalMark} = req.body;
    try {
        const studentMark = await StudentMark.findByIdAndUpdate(id, {enrollmentId, finalMark, midtermMark, practicalMark, assignmentMark, totalMark}, {new: true});
        res.status(200).json(studentMark);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteStudentMark = async (req, res) => {
    const {id} = req.params;
    try {
        const studentMark = await StudentMark.destroy({where: {id}});
        res.status(200).json(studentMark);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {createStudentMark, updateStudentMark, deleteStudentMark}; 
