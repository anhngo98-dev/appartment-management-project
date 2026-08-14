const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, tenantController.getAllTenants);
router.get('/stats/active', protect, tenantController.getActiveTenants);
router.get('/:id', protect, tenantController.getTenant);
router.post('/', protect, authorize('admin', 'manager'), tenantController.createTenant);
router.put('/:id', protect, authorize('admin', 'manager'), tenantController.updateTenant);
router.delete('/:id', protect, authorize('admin'), tenantController.deleteTenant);

module.exports = router;
