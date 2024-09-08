import { connect } from "../../../helper/dbConfig"; // Adjust the path to your db module
import { Course } from "../../../../lib/dbModels/dbModels";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req) {
  await connect();
  try {
    const body = await req.json();
    const { courseClassification, forSemester } = body;

    console.log(courseClassification);

    const courses = await Course.find({
      courseClassification: courseClassification,
      forSemester: forSemester,
    }); // Fetch data from the database

    console.log(courses);

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error("Error getting Lab Data:", error);
    return NextResponse.json(
      { message: "Error Getting Lab data" },
      { status: 500 }
    );
  }
}
