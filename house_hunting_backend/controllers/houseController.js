const House = require('../models/House');

// 1. Add a new house listing
exports.addHouse = async (req, res) => {
  try {
    const house = await House.create(req.body);
    res.status(201).json({ success: true, house });
  } catch (error) {
    console.error('Error adding house:', error);
    res.status(500).json({ error: 'Failed to create house listing.' });
  }
};

// 2. Search & filter houses (by location, rent, bedrooms)
exports.getHouses = async (req, res) => {
  try {
    const { location, maxRent, bedrooms } = req.query;
    const houses = await House.search({ location, maxRent, bedrooms });
    res.json({ success: true, count: houses.length, houses });
  } catch (error) {
    console.error('Error fetching houses:', error);
    res.status(500).json({ error: 'Failed to fetch houses.' });
  }
};

// 3. Get single house by ID
exports.getHouseById = async (req, res) => {
  try {
    const house = await House.getById(req.params.id);
    if (!house) {
      return res.status(404).json({ error: 'House not found.' });
    }
    res.json({ success: true, house });
  } catch (error) {
    console.error('Error fetching house details:', error);
    res.status(500).json({ error: 'Failed to fetch house details.' });
  }
};