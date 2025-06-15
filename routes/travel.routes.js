const express = require('express');
const router = express.Router();
const controller = require('../controllers/travel.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

// Public routes
router.get('/', controller.getAllTravels);
router.get('/:id', controller.getTravelById);

// Protected routes (require token)
router.post('/', [verifyToken, upload.single('imageId')], controller.createTravel);
router.put('/:id', [verifyToken, upload.single('imageId')], controller.updateTravel);
router.delete('/:id', [verifyToken], controller.deleteTravel);

module.exports = router;