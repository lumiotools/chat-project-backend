import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";

export const sendRequestController = async (req, res) => {
  try {
    const { token, to } = req.body;

    // Verify the token and extract the sender's ID
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const from = decodedToken?.id;

    // Validate the `from` and `to` fields
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Sender and receiver details are required.",
      });
    }

    // Check if `from` and `to` are the same
    if (from === to) {
      return res.status(400).json({
        success: false,
        message: "Sender and receiver cannot be the same.",
      });
    }

    // Check if the request has already been sent
    const existingRequest = await prisma.request.findFirst({
      where: {
        from,
        to,
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request has already been sent.",
      });
    }

    // Create and save the new request
    await prisma.request.create({
      data: {
        from,
        to,
      },
    });

    res.status(200).json({
      success: true,
      message: "Request sent successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
