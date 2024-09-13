import { connect } from "../../../../helper/dbConfig";
import { User } from "../../../../../lib/dbModels/dbModels";
import { NextResponse, NextRequest } from "next/server";
// import { cookies } from "next/headers";

export async function POST(req) {
  const MUJid = req.cookies.get("MUJid")?.value;
  console.log("MUJid:", MUJid);

  if (!MUJid) {
    return NextResponse.json({ message: "MUJid is required" }, { status: 400 });
  } else {
    await connect();
    try {
      const user = await User.findOne({ mujid: MUJid, isAdmin: true });
      if (!user) {
        return NextResponse.json(
          { message: "Admin not found" },
          { status: 404 }
        );
      } else {
        return NextResponse.json({ adminName: user.name }, { status: 200 });
      }
    } catch (error) {
      return NextResponse.json("Failed to fetch user", 500);
    }
  }

  //   await connect();
  //   try {
  //     const MUJid = req.cookies.get("mujid")?.value;
  //     if (!MUJid) {
  //       return NextResponse.json(
  //         { message: "MUJid is required in cookies" },
  //         { status: 400 }
  //       );
  //     } else {
  //       const user = await User.findOne({ mujid: MUJid, isAdmin: true });
  //       if (!user) {
  //         return NextResponse.json(
  //           { message: "Admin not found" },
  //           { status: 404 }
  //         );
  //       } else {
  //         return NextResponse.json({ adminName: user.name }, { status: 200 });
  //       }
  //     }
  //   } catch (error) {
  //     return NextResponse.json("Failed to fetch user", 500);
  //   }
}
