// Import the vendorLoginModel from the form.model file
const { vendorLoginModel } = require("../model/form.model");
const chatModel = require("../model/chat.model");

exports.fetchLearners = async (req, res) => {
  try {
    const learnerData = await vendorLoginModel
      .find({ usertype: 1 })
      .populate("vendorid");
    res.status(200).json(learnerData);
  } catch (err) {
    console.error("Error fetching learners:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fetchVendors = async (req, res) => {
  try {
    const learnerData = await vendorLoginModel
      .find({ usertype: 3 })
      .populate("vendorid");
    res.status(200).json(learnerData);
  } catch (err) {
    console.error("Error fetching learners:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.send = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const newMessage = await chatModel.create({
      senderId,
      receiverId,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.getChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const chatData = await chatModel.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    res.status(200).json(chatData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Inetranl server error" });
  }
};
