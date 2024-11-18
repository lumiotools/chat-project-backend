import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";

export const getAllUsersAcceptRequests = async (req, res) => {
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

    // Fetch all pending requests where:
    // 1. `to` matches the current user ID.
    // 2. Requests are not accepted or rejected.
    const sentRequests = await prisma.request.findMany({
      where: {
        OR: [
          { to: userId, is_accepted: true, is_rejected: false }, // Regular `to` field
          { from: userId, is_accepted: true, is_rejected: false }, // Check if current user sent the request
        ],
      },
      select: {
        from: true,
        to: true,
      },
    });

    // Collect all alternative user IDs (both `from` and `to`)
    const relatedUserIds = sentRequests
      .map((request) => (request.from === userId ? request.to : request.from))
      .filter((id) => id !== userId); // Ensure we exclude the current user ID

    // Filter users to include only those matching the related user IDs
    const DBUsers = users.filter((user) => relatedUserIds.includes(user.id));

    if (DBUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Users list retrieved successfully",
      data: DBUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
