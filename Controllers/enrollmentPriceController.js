const EnrollmentPrice = require('../Models/enrollmentPrice');
const Semester = require('../Models/semester');
const { Op } = require('sequelize');

const create = async (req, res) => {
    const { price, year } = req.body;
    try {
        const enrollmentPrice = await EnrollmentPrice.create({ price, year });
        res.status(201).json(enrollmentPrice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const index = async (req, res) => {
    try {
        const { year } = req.query;

        const queryOptions = {
            where: {},
        };

        if (year) {
            queryOptions.where.year = year;
        }

        const enrollmentPrices = await EnrollmentPrice.findAll(queryOptions);

        res.status(200).json(enrollmentPrices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateEnrollmentPrice = async (req, res) => {
    const { id } = req.params;
    const { price, year } = req.body;
    try {
        const enrollmentPrice = await EnrollmentPrice.update({ price, year }, { where: { id } });
        res.status(200).json(enrollmentPrice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEnrollmentPrice = async (req, res) => {
    const { id } = req.params;
    try {
        const enrollmentPrice = await EnrollmentPrice.destroy({ where: { id } });
        res.status(200).json(enrollmentPrice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { create, updateEnrollmentPrice, deleteEnrollmentPrice, index };
