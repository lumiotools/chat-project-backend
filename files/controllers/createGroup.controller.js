import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";

export const createGroupController = async (req, res) => {
  try {
    const { token, groupName, about, profileImage } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "User not logged in",
      });
    }

    // Verify the token and extract the user ID
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedData.id;

    // Check if a group with the provided group name already exists
    const existingGroup = await prisma.group.findUnique({
      where: { group_name: groupName},
    });

    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: "Group already exists",
      });
    }

    // Create a new group
    await prisma.group.create({
      data: {
        groupName,
        about: about || "Default group description",
        profile_image: profileImage || "https://default-profile-image.com/default.jpg",
        group_admin: userId,
        members: {
          connect: [{ id: userId }], // Connect the user as a member of the group
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Group created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
