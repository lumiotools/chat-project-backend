import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";

export const getAllUsersSentRequests = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "User not logged in" });
    }

    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const senderId = decodedData.id;

    console.log("User: ");

    // Get all users except the sender
    const users = await prisma.user.findMany({
      where: { id: { not: senderId } },
      select: {
        id: true,
        user_name: true,
        about: true,
        profile_image: true,
      },
    });

    // Fetch all requests sent by the sender
    const sentRequests = await prisma.request.findMany({
      where: { from: senderId },
      select: { to: true },
    });

    // Get IDs of users to whom requests are already sent
    const sentUserIds = sentRequests.map((request) => request.to);

    // Filter out users to whom requests are already sent
    const filteredUsers = users.filter((user) => !sentUserIds.includes(user.id));

    if (filteredUsers.length === 0) {
      return res.status(404).json({ success: false, message: "Users not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: filteredUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
