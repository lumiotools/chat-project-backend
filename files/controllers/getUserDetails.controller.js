import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";
export const getUserDetailController = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
     return res.status(400).json({ sucess: false, message: "User Not Login" });
    }
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const id = decodedData.id;
   const DBUser = await prisma.user.findUnique({
    where:{
      id
    }
   })

    if (!DBUser) {
      return  res.status(400).json({ sucess: false, message: "user not found" });
    }

   return  res.status(200).json({
      sucess: true,
      message: "profile update  successfully",
      data: {
        email: DBUser?.email,
        profileImage: DBUser?.profile_image,
        about: DBUser?.about,
        age: DBUser?.age,
        userName: DBUser?.user_name,
      },
    });
  } catch (error) {
    console.log(error);
   return res.status(500).json({ sucess: false, message: "Internal server error" });
  }
};
