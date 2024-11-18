import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";

export const getMessagesController = async (req, res) => {
  try {
    const { token, chatId, chatType } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "User not logged in",
      });
    }

    if (!chatType || !chatId || (chatType !== "friend" && chatType !== "group")) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Please provide correct chatType and chatId.",
      });
    }

    // Verify the token and extract the user ID
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedData.id;

    let data;
    if (chatType === "friend") {
      // Fetch friend chat messages
      data = await prisma.message.findMany({
        where: {
          OR: [
            { from: userId, to: chatId },
            { from: chatId, to: userId },
          ],
        },
        orderBy: { created_at: "asc" }, // Sort messages by creation time
      });
    } else if (chatType === "group") {
      // Fetch group chat messages
      data = await prisma.groupMessages.findMany({
        where: { to: chatId },
        orderBy: { created_at: "asc" }, // Sort messages by creation time
      });
    }

    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: data || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
