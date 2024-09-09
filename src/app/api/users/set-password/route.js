import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connect } from "@/app/helper/dbConfig";
import { User } from "@/lib/dbModels/dbModels";

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    await connect();

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.email) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }
    const { email } = decoded;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    if (user.tokenUsed) {
      return NextResponse.json(
        { message: "Token has already been used" },
        { status: 400 }
      );
    }

    try {
      jwt.verify(token, user.jwtSecretKey);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.tokenUsed = true;
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
