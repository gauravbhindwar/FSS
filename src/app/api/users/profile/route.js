import { connect } from "../../../helper/dbConfig";
import { User } from "../../../../lib/dbModels/dbModels";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();
    const users = await User.find({});
    return NextResponse.json({ users });
  } catch (error) {
    // console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
