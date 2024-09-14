import { connect } from "../../../helper/dbConfig";
import { Term } from "../../../../lib/dbModels/dbModels";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connect();
    const terms = await Term.findOne({});
    const forTerm = terms.forTerm;
    return NextResponse.json({ forTerm }, { status: 200 });
  } catch (error) {
    // console.error("Error fetching terms:", error);
    return NextResponse.json(
      { error: "Error fetching terms" },
      { status: 500 }
    );
  }
}
