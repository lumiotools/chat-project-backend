import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/prismaClient.js";


export const updatePasswordController = async (req, res) => {
  try {
    
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400).json({ sucess: false, message: "data not found" });
    }
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const id = decodedData.id;

   
    const DBUser = await prisma.user.findUnique({
      where:{
        id
      }
    });
  

    if (!DBUser) {
      res.status(400).json({ sucess: false, message: "user not found" });
    }

    // hash user password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const updatedUserData= await prisma.user.update({
      where:{
        id
      },
      data:{
        password:hash
      }
    })

    
    console.log(updatedUserData);
    res.status(200).json({
      sucess: true,
      message: "password updated successfully",
      data: {
        message: "password updated",
      },
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ sucess: false, message: "Internal server error" });
  }
};
