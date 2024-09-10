import { connect } from "../../../helper/dbConfig";
import { User, Form } from "../../../../lib/dbModels/dbModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const mujid = searchParams.get("mujid");

    if (!mujid) {
      return NextResponse.json({ error: "mujid is required" }, { status: 400 });
    }

    // Fetch the specific form by mujid
    const form = await Form.findOne({ mujid })
      .populate({
        path: "courses",
        select: "title description",
      })
      .populate({
        path: "user",
        select: "name email mujid",
      })
      .exec();

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Map the data to include only necessary fields
    const reportData = {
      userName: form.user?.name || "N/A",
      userEmail: form.user?.email || "N/A",
      mujid: form.user?.mujid || "N/A",
      formSubmissionDate: form.createdAt,
    };

    return NextResponse.json({ reportData }, { status: 200 });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Error generating report" },
      { status: 500 }
    );
  }
}
