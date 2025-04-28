const Subject = require('../Models/subject');
const Tsection = require('../Models/tSection');
const PSection = require('../Models/pSection');
const tTeacher = require('../Models/tTeacher')
const pTeacher = require('../Models/pTeacher')
const User = require('../Models/user')
const Teacher = require('../Models/teacher')
const { Op } = require('sequelize');


const createSubject = async (req, res) => {
    const { name, description, prerequisites, requiredFor, subjectType, hours, academicYear, hasPractical } = req.body;
    try {
        const subject = await Subject.create({ name, description, prerequisites, requiredFor, subjectType, hours, academicYear, hasPractical });

        await Tsection.create({ subjectId: subject.id, t_hours: hours });

        if (hasPractical === true) {
            await Psection.create({ subjectId: subject.id, p_hours: hours });
        }
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const index = async (req, res) => {
    try {

        const { name, academicYear, hasPractical, subjectType, hours } = req.query;

        const queryOptions = {
            where: {},

            include: [
                {
                    model: PSection,
                    include: [
                        {
                            model: Teacher,
                            include: User,
                        }
                    ]
                },
                {
                    model: Tsection,
                    include: [
                        {
                            model: Teacher,
                            include: User

                        }
                    ]
                },
                {
                    model: Subject,
                    as: 'required_for',
                    attributes: ['id', 'name']
                },
                {
                    model: Subject,
                    as: 'prerequisites',
                    attributes: ['id', 'name']

                }
            ]

        };

        if (name) {
            queryOptions.where.name = { [Op.like]: `%${name}%` };
        }

        if (academicYear) {
            queryOptions.where.academicYear = academicYear;
        }

        if (hasPractical !== undefined) {
            queryOptions.where.hasPractical = hasPractical === 'true';
        }

        if (subjectType) {
            queryOptions.where.subjectType = subjectType;
        }

        if (hours) {
            queryOptions.where.hours = hours;
        }

        const subjects = await Subject.findAll(queryOptions,);

        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const get = async (req, res) => {
    try {
        const { id } = req.params
        const subjects = await Subject.findByPk(id, {
            include: [
                {
                    model: PSection,

                    include: [
                        {
                            model: Teacher,
                            include: User
                        }
                    ]
                },
                {
                    model: Tsection,
                    include: [
                        {
                            model: Teacher,
                            include: User

                        },

                    ]
                },
                {
                    model: Subject,
                    as: 'required_for',
                    attributes: ['id', 'name']
                },
                {
                    model: Subject,
                    as: 'prerequisites',
                    attributes: ['id', 'name']

                }
            ]
        });
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPSection = async (req, res) => {
    try {
        const { id } = req.params
        const { time, p_hours, teacherId } = req.body

        const subject = await Subject.findByPk(id)
        if (!subject.hasPractical)
            throw new Error("Subject Doesn`t have Practical Section")



        const p_section = await PSection.create({
            subjectId: id,
            time,
            p_hours
        })


        const p_teacher = await pTeacher.create({
            teacherId,
            pSectionId: p_section.id
        })

        if (!p_teacher)
            throw new Error("there is issue with creating the t teacher")

        res.status(200).json({ p_section, p_teacher });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createTSection = async (req, res) => {
    try {
        const { id } = req.params
        const { time, t_hours, teacherId } = req.body
        const t_section = await Tsection.create({
            subjectId: id,
            time,
            t_hours
        })

        if (!t_section)
            throw new Error("there is issue with creating the t section")

        const t_teacher = await tTeacher.create({
            teacherId: teacherId,
            tSectionId: t_section.id
        })

        if (!t_teacher)
            throw new Error("there is issue with creating the t teacher")
        res.status(200).json({ t_section, t_teacher });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteSubjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await Subject.destroy({ where: { id } });
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSubjectByName = async (req, res) => {
    const { name } = req.params;
    try {
        const subject = await Subject.destroy({ where: { name } });
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { createSubject, deleteSubjectById, deleteSubjectByName, index, get, createPSection, createTSection };
