const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.create({
      sender: req.user.id,
      senderRole: req.user.role,
      content
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort('-createdAt').populate('sender', 'name email');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
