import { Store, Rating, User } from '../models/index.js';
import { Op } from 'sequelize';

// MODIFICATION: Added controller for owner to get their specific store
export const getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { owner_id: req.user.id },
      include: [{ model: Rating, attributes: ['rating', 'user_id', 'id'] }]
    });
    if (!store) {
      return res.status(404).json({ error: 'Store not found for this owner.' });
    }
    res.json(store);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    const store = await Store.create({ name, email, address, owner_id });
    res.status(201).json(store);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Store email already exists.' });
    }
    res.status(400).json({ error: e.message });
  }
};

// MODIFICATION: Enhance getAllStores to support filtering
export const getAllStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;
    const where = {};
    
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [
        { model: Rating, attributes: ['rating'] },
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }
      ],
      order: [['name', 'ASC']]
    });

    const result = stores.map(store => {
      const ratings = store.Ratings || [];
    const avg = ratings.length
      ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(2)
      : null;
    return { ...store.toJSON(), averageRating: avg };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stores.' });
  }
};