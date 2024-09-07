import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connect } from "@/app/helper/dbConfig";
import { User } from "@/lib/dbModels/dbModels";

export async function POST(req) {
  const body = await req.json();
  const { token, password } = body;

  if (!token || !password) {
    return NextResponse.json(
      { message: "Token and password are required" },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await connect();

    // Decode the token to get the email
    const decoded = jwt.decode(token);
    const { email } = decoded;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Invalid token:", token);
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    // Verify the JWT token with the user's unique secret key
    jwt.verify(token, user.jwtSecretKey);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and set tokenUsed to true
    user.tokenUsed = true;
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
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
