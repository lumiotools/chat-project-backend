import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOTP } from "../utils/genrateOtp.js";
import { prisma } from "../utils/prismaClient.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user details is passed or not
    if (!email || !password) {
      res
        .status(404)
        .json({ sucess: false, message: "please provide email and password" });
      return;
    }


    const DBUser = await prisma.user.findUnique({
      where:{
        email
      }
    });
    

    // check if user is already registered or not
    if (!DBUser) {
      res
        .status(404)
        .json({ sucess: false, message: "user not exists" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, DBUser.password);
    if (!passwordMatch) {
      res
        .status(404)
        .json({ sucess: false, message: "password does not match.." });
      return;
    }

    if (DBUser.isTwoFactorEnabled === true) {
      //   sent user verification email
      const otp = generateOTP();
      sendEmail(email, otp);
      DBUser.otp = otp;
    }
    const token = jwt.sign(
      { id: DBUser.id, email: DBUser.email },
      process.env.SECRET_KEY
    );
    DBUser.token = token;
    res.status(200).json({
      sucess: true,
      message: "User login successfully",
      data: {
        email: DBUser.email,
        token: DBUser.token,
        otp: DBUser.otp,
        isVerifyed: DBUser.isVerifyed,
        isTwoFactorEnabled: DBUser.isTwoFactorEnabled,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ sucess: false, message: "Internal server error" });
  }
};
