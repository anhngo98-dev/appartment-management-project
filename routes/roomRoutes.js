const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, roomController.getAllRooms);
router.get('/stats', protect, roomController.getRoomStats);
router.get('/:id', protect, roomController.getRoom);
router.post('/', protect, authorize('admin', 'manager'), roomController.createRoom);
router.put('/:id', protect, authorize('admin', 'manager'), roomController.updateRoom);
router.delete('/:id', protect, authorize('admin'), roomController.deleteRoom);

module.exports = router;
