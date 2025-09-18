import { Rating, User } from '../models/index.js';

export const submitRating = async (req, res) => {
  const { store_id, rating } = req.body;
  // Use 'upsert' to either create a new rating or update an existing one from the same user for the same store.
  const [r, created] = await Rating.upsert({
    user_id: req.user.id,
    store_id,
    rating
  });
  res.status(created ? 201 : 200).json({ message: created ? 'Rating submitted' : 'Rating updated' });
};

export const getRatingsForStore = async (req, res) => {
  const { storeId } = req.params;
  const ratings = await Rating.findAll({ 
    where: { store_id: storeId },
    include: [{ model: User, attributes: ['id', 'name']}] // Include user info with ratings
  });
  res.json(ratings);
};