import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";
export const verifyUserController = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ sucess: false, message: "user not found" });
    }
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const id = decodedData.id;

    const DBUser= await prisma.user.findUnique({
      where:{
        id
      }
    })

    if (!DBUser) {
      res.status(400).json({ sucess: false, message: "user not found" });
    }


    await prisma.user.update({
      where:{
        id
      },
      data:{
        isVerifyed: true
      }
    });

    
    res.status(200).json({
      sucess: true,
      message: "verification successfully",
      data: {
        message: "verification updated",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ sucess: false, message: "Internal server error" });
  }
};
