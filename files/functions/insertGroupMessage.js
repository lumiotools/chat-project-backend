import { prisma } from "../../files/utils/prismaClient.js";

export async function insertGroupMessage(groupId, from, message, messageType = "TEXT") {
  try {
    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true }, // Include members to check user membership
    });

    if (!group) {
      return { success: false, message: "Group not found." };
    }

    // Check if the 'from' user is a member of the group
    const isMember = group.members.some((member) => member.id === from);
    if (!isMember) {
      return { success: false, message: "User is not a member of the group." };
    }

    // Add the new message to the group's messages
    await prisma.groupMessages.create({
      data: {
        from,
        to: groupId,
        message,
        message_type:messageType,
      },
    });

    return { success: true, message: "Message added to the group." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
