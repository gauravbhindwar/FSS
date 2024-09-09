import { connect } from "@/app/helper/dbConfig";
import { User } from "@/lib/dbModels/dbModels";
import { NextResponse } from "next/server";
import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  mujid: Joi.string().required(),
  isAdmin: Joi.boolean().optional(),
  password: Joi.string().min(6).optional(),
});

export async function POST(req) {
  await connect();

  const { email, name, isAdmin, mujid } = await req.json();

  const adminStatus = isAdmin;

  const { error } = userSchema.validate({
    email,
    name,
    mujid,
  });
  if (error)
    return NextResponse.json(
      { error: error.details[0].message },
      { status: 400 }
    );

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return NextResponse.json(
      { error: "Can't use same email or mujid ! User already exists" },
      { status: 400 }
    );

  const newAdmin = new User({
    email,
    name,
    isAdmin,
    mujid,
    isAdmin,
  });

  await newAdmin.save();

  if (adminStatus) {
    return NextResponse.json(
      { message: "Admin Added successfully" },
      { status: 201 }
    );
  } else {
    return NextResponse.json(
      { message: "User Added successfully" },
      { status: 201 }
    );
  }
}

export async function GET() {
  await connect();

  const users = await User.find({});

  return NextResponse.json({ users }, { status: 200 });
}

export async function DELETE(req) {
  await connect();

  const { email } = await req.json();

  const deletedUser = await User.findOneAndDelete({ email });

  return NextResponse.json({ deletedUser }, { status: 200 });
}

// export async function PUT(req) {
//   await connect();

//   const { email } = await req.json();

//   const updatedUser = await User.findOneAndUpdate(
//     { email },
//     { isAdmin: true },
//     { new: true }
//   );

//   return NextResponse.json({ updatedUser }, { status: 200 });
// }
