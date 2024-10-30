const EnrollmentPrice = require('../Models/enrollmentPrice');
const Semester = require('../Models/semester');

const createEnrollmentPrice = async (req, res) => {
    const {price, year} = req.body;
    try {
        const enrollmentPrice = await EnrollmentPrice.create({price, year});
        res.status(201).json(enrollmentPrice);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateEnrollmentPrice = async (req, res) => {
    const {id} = req.params;
    const {price, year} = req.body;
    try {
        const enrollmentPrice = await EnrollmentPrice.update({price, year}, {where: {id}});
        res.status(200).json(enrollmentPrice);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteEnrollmentPrice = async (req, res) => {
    const {id} = req.params;
    try {
        const enrollmentPrice = await EnrollmentPrice.destroy({where: {id}});
        res.status(200).json(enrollmentPrice);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {createEnrollmentPrice, updateEnrollmentPrice, deleteEnrollmentPrice};
