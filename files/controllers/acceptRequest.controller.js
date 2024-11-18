import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";

export const acceptRequestController = async (req, res) => {
  try {
    const { token, to } = req.body;

    // Check if the token exists
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "User not logged in",
      });
    }

    // Verify and decode the token
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const from = decodedData.id;

    // Find the request where `from` matches `to` and `to` matches `from`
    const request = await prisma.request.findFirst({
      where: {
        from: to,
        to: from,
      },
    });
console.log(request);

    // Check if the request exists
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Check if the request is already accepted
    if (request.is_accepted) {
      return res.status(400).json({
        success: false,
        message: "Request already accepted",
      });
    }


    // Update the request to mark it as accepted
    await prisma.request.update({
      where: { id: request.id },
      data: { is_accepted: true },
    });

    res.status(200).json({
      success: true,
      message: "Request accepted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
