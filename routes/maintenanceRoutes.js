const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, maintenanceController.getAllMaintenance);
router.get('/stats', protect, maintenanceController.getMaintenanceStats);
router.get('/:id', protect, maintenanceController.getMaintenance);
router.post('/', protect, authorize('admin', 'manager', 'staff'), maintenanceController.createMaintenance);
router.put('/:id', protect, authorize('admin', 'manager'), maintenanceController.updateMaintenance);
router.delete('/:id', protect, authorize('admin'), maintenanceController.deleteMaintenance);

module.exports = router;
