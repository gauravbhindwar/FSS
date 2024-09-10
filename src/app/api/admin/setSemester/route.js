import { connect } from "@/app/helper/dbConfig";
import { Courses } from "@/lib/dbModels/dbModels";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req) {
  const { isEven } = await req.json();

  if (typeof isEven !== "boolean") {
    return NextResponse.json(
      { message: "isEven must be a boolean value" },
      { status: 400 }
    );
  }

  try {
    await connect();

    const courses = await Courses.find({ isEven });

    return NextResponse.json(
      { courses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving courses:", error);
    return NextResponse.json(
      { message: "Error retrieving courses" },
      { status: 500 }
    );
  }
}