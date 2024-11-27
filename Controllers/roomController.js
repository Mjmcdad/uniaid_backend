const Room = require('../Models/room');

const createRoom = async (req, res) => {
    const {number, floor, capacity, isPractical} = req.body;
    try {
        const room = await Room.create({number, floor, capacity, isPractical});
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateRoom = async (req, res) => {
    const {id} = req.params;
    const {number, floor, capacity, isPractical} = req.body;
    try {
        const room = await Room.update({number, floor, capacity, isPractical}, {where: {id}});
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteRoom = async (req, res) => {
    const {id} = req.params;
    try {
        const room = await Room.destroy({where: {id}});
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getRoombyNumber = async (req, res) => {
    const {number} = req.params;
    try {
        const room = await Room.findAll({where: {number}});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getPracticalRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll({where: {isPractical: true}});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getTheoricRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll({where: {isPractical: false}});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


module.exports = {createRoom, updateRoom, deleteRoom, getRoombyNumber, getPracticalRooms, getTheoricRooms};
