const Subject = require('../Models/subject');
const Tsection = require('../Models/tSection');
const Psection = require('../Models/pSection');
const Teacher = require('../Models/teacher');

const createSubject = async (req, res) => {
    const {name, hours, academicYear, hasPractical} = req.body;
    try {
        const subject = await Subject.create({name, hours, academicYear, hasPractical});

        await Tsection.create({subjectId: subject.id, teacherId: req.user.id, t_hours: hours, time: req.body.time});

        if (hasPractical) {
            await Psection.create({subjectId: subject.id, teacherId: req.user.id, p_hours: hours, time: req.body.time});
        }
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteSubjectById = async (req, res) => {
    const {id} = req.params;
    try {
        const subject = await Subject.destroy({where: {id}});
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteSubjectByName = async (req, res) => {
    const {name} = req.params;
    try {
        const subject = await Subject.destroy({where: {name}});
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// const createTsection = async (req, res) => {
//     const {subjectId, teacherId, t_hours, time} = req.body;
//     try {
//         const tSection = await Tsection.create({subjectId, teacherId, t_hours, time});
//         res.status(201).json(tSection);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };

// const createPsection = async (req, res) => {
//     const {subjectId, teacherId, p_hours, time} = req.body;
//     try {
//         const pSection = await Psection.create({subjectId, teacherId, p_hours, time});
//         res.status(201).json(pSection);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// }; 

const getSubjectsByTeacher = async (req, res) => {
    const {teacherId} = req.params;
    try {
        const tSections = await Tsection.findAll({where: {teacherId}, include: {model: Subject}});
        const pSections = await Psection.findAll({where: {teacherId}, include: {model: Subject}});
        
        const subjects = new set();
        
        tSections.forEach(tSection => subjects.add(tSection.subject));
        pSections.forEach(pSection => subjects.add(pSection.subject));

        res.status(200).json(Array.from(subjects));
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};



module.exports = {createSubject, createTsection, createPsection, getSubjectsByTeacher, deleteSubjectById, deleteSubjectByName};
