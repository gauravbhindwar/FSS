import { connect } from "../../../helper/dbConfig"; // Adjust the path if needed
import { User, Form } from "../../../../lib/dbModels/dbModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();

  try {
    // Fetch all forms with user details
    const forms = await Form.find({})
      .populate({
        path: "courses",
        select: "title description",
      })
      .populate({
        path: "user",
        select: "name email mujid",
      })
      .exec();

    // Map the data to include only necessary fields
    const reportData = forms.map((form) => ({
      userName: form.user?.name || "N/A",
      userEmail: form.user?.email || "N/A",
      mujid: form.user?.mujid || "N/A",
      formSubmissionDate: form.createdAt,
    }));

    return NextResponse.json({ reportData }, { status: 200 });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Error generating report" },
      { status: 500 }
    );
  }
}
