const Transaction = require("../Models/transactionModel");
const Student = require("../Models/studentModel");
const Subject = require("../Models/subjectModel");

const createTransaction = async (req, res) => {
    const { studentId, subjectId, amount } = req.body;
    try {
        const student = await Student.findById(studentId, {
            include: [{
                model: PriceForEnrollment,
                attributes: ['price']
            }]
        });
        const subject = await Subject.findById({subjectId, hours});
        const amount = subject.hours * student.PriceForEnrollment.price;
        const transaction = await Transaction.create({ student: studentId, subject: subjectId, amount });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTransactionByStudentId = async (req, res) => {
    const { studentId } = req.params;
    try {
        const transaction = await Transaction.findAll({ 
            where: { studentId },
            include: [{
                model: Student,
                attributes: ['id', 'name']
            }]
        });
        const subjects = transaction.map((transaction) => transaction.subject);
        res.status(200).json({ transaction, subjects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTransactionBySubjectId = async (req, res) => {
    const { subjectId } = req.params;
    try {
        const transaction = await Transaction.findAll({ 
            where: { subjectId },
            include: [{
                model: Subject,
                attributes: ['id', 'name']
            }]
        });
        const students = transaction.map((transaction) => transaction.student);
        res.status(200).json({ transaction, students });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTransaction = async (req, res) => {
    const {id} = req.params;
    const {studentId, subjectId, amount} = req.body;
    try {
        const transaction = await Transaction.findByIdAndUpdate(id, {studentId, subjectId, amount}, {new: true});
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};



module.exports = { createTransaction, getAllTransactions, getTransactionByStudentId, getTransactionBySubjectId, updateTransaction };
