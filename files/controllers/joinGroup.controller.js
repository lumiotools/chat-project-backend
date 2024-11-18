import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";

export const joinGroupController = async (req, res) => {
  try {
    const { token, groupId } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "User not logged in",
      });
    }

    // Verify the token and extract the user ID
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedData.id;

    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { id: true, members: { select: { id: true } } },
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if the user is already a member of the group
    const isAlreadyMember = group.members.some((member) => member.id === userId);
    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of the group",
      });
    }

    // Add the user to the group members
    await prisma.group.update({
      where: { id: groupId },
      data: {
        members: {
          connect: { id: userId }, // Connect the user to the group
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Group joined successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
