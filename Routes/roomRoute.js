const express = require('express');
const router = express.Router();
const roomController = require('../Controllers/roomController');

router.post('/createRoom', roomController.createRoom);
router.put('/updateRoom/:id', roomController.updateRoom);
router.delete('/deleteRoom/:id', roomController.deleteRoom);
router.get('/getRoombyNumber/:number', roomController.getRoombyNumber);
router.get('/getPracticalRooms', roomController.getPracticalRooms);
router.get('/getTheoricRooms', roomController.getTheoricRooms);

module.exports = router;

