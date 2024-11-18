import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";

export const getAllGroupJoinController = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "User not logged in",
      });
    }

    // Verify the token and extract the user ID
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedData.id;

    // Find all groups where the user is NOT a member
    const groups = await prisma.group.findMany({
      where: {
        members: {
          none: { id: userId }, // Ensures the user is NOT a member of the group
        },
      },
      select: {
        id: true,
        group_name: true,
        about: true,
        profile_image: true,
      },
    });

    if (!groups.length) {
      return res.status(404).json({
        success: false,
        message: "No groups available to join",
      });
    }

    res.status(200).json({
      success: true,
      message: "Groups available to join",
      data: groups,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
