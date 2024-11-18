import { prisma } from "../../files/utils/prismaClient.js"; // Adjust the path as needed

export async function insertUserMessage(from, to, message, messageType = "TEXT") {
  try {
    // Check if a conversation already exists between 'from' and 'to'
    const existingMessage = await prisma.message.findFirst({
      where: {
        OR: [
          { from, to },
          { from: to, to: from },
        ],
      },
    });

    if (existingMessage) {
      // If the conversation exists, update it with the new message
      await prisma.message.update({
        where: { id: existingMessage.id },
        data: {
          messages: {
            push: { from, message, messageType }, // Push the new message to the 'messages' field
          },
        },
      });

      return {
        success: true,
        message: "Message added to existing conversation.",
      };
    } else {
      // If no conversation exists, create a new one
      await prisma.message.create({
        data: {
          from,
          to,
          messages: [{ from, message, messageType }],
        },
      });

      return {
        success: true,
        message: "New conversation created.",
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
