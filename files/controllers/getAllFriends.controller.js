import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";

export const getAllFrendsRequests = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "User not logged in",
      });
    }

    // Decode the token to get the current user's ID
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedData.id;

    // Fetch all users except the current user
    const users = await prisma.user.findMany({
      where: { id: { not: userId } },
      select: {
        id: true,
        user_name: true,
        about: true,
        profile_image: true,
      },
    });

    // Fetch all accepted requests sent by the current user
    const sentRequests = await prisma.request.findMany({
      where: {
        from: userId,
        is_accepted: true,
        is_rejected: false,
      },
      select: {
        to: true,
      },
    });

    // Get IDs of users to whom requests are already accepted
    const sentUserIds = sentRequests.map((request) => request.to);

    // Filter users who match the accepted request IDs
    const friends = users.filter((user) => sentUserIds.includes(user.id));

    if (friends.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Friends not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Friends list retrieved successfully",
      data: friends,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
