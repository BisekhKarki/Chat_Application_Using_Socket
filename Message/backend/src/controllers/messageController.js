const cloudinary = require("../lib/cloudinary");
const Message = require("../models/MessageModel");

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserID = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserID },
    }).select("-password");
    res.status(200).json({
      sucess: false,
      filteredUsers,
    });
  } catch (error) {
    console.log("Error in GetUsersForSidebar Controller", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiver: userToChatId },
        { receiver: userToChatId, senderId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in Get Messages Controller", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let ImageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      ImageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: ImageUrl,
    });

    await newMessage.save();

    // todo: Real time functionality goes here ==> socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in Send Messages Controller", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { getUsersForSidebar, getMessages, sendMessages };
