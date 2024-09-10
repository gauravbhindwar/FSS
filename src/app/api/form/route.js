import { connect } from "../../helper/dbConfig";
import { Form } from "../../../lib/dbModels/dbModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { allSelectedCourses } = await req.json();
  //   const { allSelectedCourses, mujid } = await req.json();

  //   if (!allSelectedCourses || !mujid) {
  //     return NextResponse.json(
  //       { message: "allSelectedCourses and mujid are required" },
  //       { status: 400 }
  //     );
  //   }

  if (!allSelectedCourses) {
    return NextResponse.json(
      { message: "allSelectedCourses are required" },
      { status: 400 }
    );
  }

  try {
    await connect();

    // Create a new form entry
    const formEntry = new Form({
      allSelectedCourses,
      //   mujid,
    });

    // Save the form entry to the database
    await formEntry.save();

    return NextResponse.json(
      { message: "Form submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving form data:", error);
    return NextResponse.json(
      { message: "Error saving form data" },
      { status: 500 }
    );
  }
}
