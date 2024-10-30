const MarkSplit = require('../Models/markSplit');
const SubjectOffer = require('../Models/subjectOffer');
const Assignments = require('../Models/assginments');

const createMarkSplit = async (req, res) => {
    const {subjectOfferId, finalMark, midtermMark, practicalMark, assignmentMark} = req.body;
    try {
        const markSplit = await MarkSplit.create({subjectOfferId, finalMark, midtermMark, practicalMark, assignmentMark});
        res.status(201).json(markSplit);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateMarkSplit = async (req, res) => {
    const {id} = req.params;
    const {subjectOfferId, finalMark, midtermMark, practicalMark, assignmentMark} = req.body;
    try {
        const markSplit = await MarkSplit.update({subjectOfferId, finalMark, midtermMark, practicalMark, assignmentMark}, {where: {id}});
        res.status(200).json(markSplit);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteMarkSplit = async (req, res) => {
    const {id} = req.params;
    try {
        const markSplit = await MarkSplit.destroy({where: {id}});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateAssignmentMark = async (markSplitId) => {
    try {
        const assginments = await Assignments.findAll({where: {markSplitId}});

    const totalMarks = assginments.reduce((sum, assignment) => sum + assignment.mark, 0);

    await MarkSplit.update (
        {assignmentMark: totalMarks},
            {where: {id: markSplitId}}
        );
    } catch (error) {
        console.log(error);
    }
};

module.exports = {createMarkSplit, updateMarkSplit, deleteMarkSplit, updateAssignmentMark};


