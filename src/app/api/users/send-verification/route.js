import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { connect } from "@/app/helper/dbConfig";
import { User } from "@/lib/dbModels/dbModels";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  const body = await req.json();
  const { email } = body;

  console.log("Received email:", email);

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    await connect();

    const user = await User.findOne({ email });

    console.log("Found user:", user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate a unique secret key for the user
    const userSecretKey = uuidv4();

    // Generate JWT token with the unique secret key
    const verificationToken = jwt.sign({ email }, userSecretKey, {
      expiresIn: "1h",
    });

    // Store the secret key and set tokenUsed flag to false
    user.jwtSecretKey = userSecretKey;
    user.tokenUsed = false;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by clicking the following link: ${process.env.BASE_URL}/verify-email?token=${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Verification email sent" },
      { status: 202 }
    );
  } catch (error) {
    console.log("Error sending email:", error);
    return NextResponse.json(
      { message: "Error sending email" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const body = await req.json();
  const { token } = body;

  if (!token) {
    return NextResponse.json(
      { message: "Verification token is required" },
      { status: 400 }
    );
  }

  try {
    // Decode the token to get the email
    const decoded = jwt.decode(token);
    const { email } = decoded;

    await connect();

    const user = await User.findOne({ email });

    console.log("Found user:", user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if the token has already been used
    if (user.tokenUsed) {
      return NextResponse.json(
        { message: "Token has already been used" },
        { status: 400 }
      );
    }

    // Verify the JWT token with the user's unique secret key
    jwt.verify(token, user.jwtSecretKey);

    // Update the user's verification status and set tokenUsed to true
    user.isVerified = true;
    user.tokenUsed = true;
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error verifying token:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
