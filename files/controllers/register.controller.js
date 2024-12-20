import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOTP } from "../utils/genrateOtp.js";
import { prisma } from "../utils/prismaClient.js";

export const registerController = async (req, res) => {
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
      where: {
        email,
      },
    });


    // check if user is already registered or not
    if (DBUser) {
      res.status(404).json({ sucess: false, message: "user already exists" });
      return;
    }

    // hash user password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const storedUser = await prisma.user.create({
      data: { email, password: hash },
    });

    //   sent user verification email
    const otp = generateOTP();
    sendEmail(email, otp);
    storedUser.otp = otp;
    const token = jwt.sign(
      { id: storedUser.id, email: storedUser.email },
      process.env.SECRET_KEY
    );
    storedUser.token = token;
    res.status(200).json({
      sucess: true,
      message: "User registered successfully",
      data: {
        email: storedUser.email,
        token: storedUser.token,
        otp,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ sucess: false, message: "Internal server error" });
  }
};
