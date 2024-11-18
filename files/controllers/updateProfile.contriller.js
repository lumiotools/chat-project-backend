import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient.js";
export const updateUserProfileController = async (req, res) => {
  try {
    const { token, profileImage, about, age, userName } = req.body;
    if (!token || !profileImage || !about || !age || !userName) {
      res
        .status(400)
        .json({ sucess: false, message: "provide all user details" });
    }

    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const id = decodedData.id;

    
      // find user
     const DBUser = await prisma.user.findUnique({
      where:{
        id
      }
     })
 

    if (!DBUser) {
      res.status(400).json({ sucess: false, message: "user not found" });
    }
    const updatedUserData= await prisma.user.update({where:{id},data:{profile_image: profileImage,about,age,user_name:userName}})

    res.status(200).json({
      sucess: true,
      message: "profile update  successfully",
      data: {
        profileImage: updatedUserData.profile_image,
        about: updatedUserData.about,
        age: updatedUserData.age,
        userName: updatedUserData.user_name,
      },
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ sucess: false, message: "Internal server error" });
  }
};
