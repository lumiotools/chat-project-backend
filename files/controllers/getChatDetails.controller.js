import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";

export const getChatDetailsController = async (req, res) => {
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
        message: "Invalid data. Please provide correct data.",
      });
    }

    // Verify the token and extract the user ID
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedData.id;

    let data;
    if (chatType === "friend") {
      // Fetch user details for friend chat
      data = await prisma.user.findUnique({
        where: { id: chatId },
        select: {
          id: true,
          user_name: true,
          about: true,
          profile_image: true,
        },
      });

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Friend not found",
        });
      }
    } else if (chatType === "group") {
      // Fetch group details for group chat
      data = await prisma.group.findUnique({
        where: { id: chatId },
        select: {
          id: true,
          group_name: true,
          about: true,
          profile_image: true,
        },
      });

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Group not found",
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Chat details retrieved successfully",
      data,
      userId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
