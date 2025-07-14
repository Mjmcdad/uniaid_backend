const Rating = require("../Models/rating");
const User = require("../Models/user");

const createRating = async (req, res) => {
  const { rate, chat, comment, user_id } = req.body;
  try {
    if (!rate) throw new Error("rate is required");
    if (!chat) throw new Error("chat is required");

    const rating = await Rating.create({
      rate: rate,
      chat: chat,
      user_id: user_id,
      comment: comment,
    });

    if (!rating) throw new Error("Rate isn`t created");

    res.status(201).json({ rating: rating });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({ include: { model: User } });

    res.status(200).json({ ratings: ratings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRating, getRatings };
