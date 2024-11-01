const Assignment = require('../Models/assignment');
const MarkSplit = require('../Models/markSplit');

const createAssignment = async (req, res) => {
    const {subjectOfferId, markSplitId, assignmentDate, assignmentName, assignmentDescription} = req.body;
    try {
        const assignment = await Assignment.create({subjectOfferId, markSplitId, assignmentDate, assignmentName, assignmentDescription});
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateAssignment = async (req, res) => {
    const {id} = req.params;
    const {subjectOfferId, markSplitId, assignmentDate, assignmentName, assignmentDescription} = req.body;
};

const deleteAssignment = async (req, res) => {
    const {id} = req.params;
    try {
        const assignment = await Assignment.destroy({where: {id}});
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {createAssignment, updateAssignment, deleteAssignment};
