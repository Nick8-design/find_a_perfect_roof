const express = require('express');
const router = express.Router();
const houseController = require('../controllers/houseController');

// GET /api/houses (search & filter: ?location=Westlands&maxRent=800&bedrooms=2)
router.get('/', houseController.getHouses);

// GET /api/houses/:id (single house details)
router.get('/:id', houseController.getHouseById);

// POST /api/houses (endpoint to add a new house to the database)
router.post('/', houseController.addHouse);

module.exports = router;