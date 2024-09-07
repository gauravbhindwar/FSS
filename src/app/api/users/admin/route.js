import { connect } from "@/app/helper/dbConfig";
import { User } from "@/lib/dbModels/dbModels";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import bcrypt from "bcrypt";

// Connect to the database
await connect();

// Define the schema for admin user validation
const adminSchema = Joi.object({
  email: Joi.string().email().required(),
  //   password: Joi.string().min(6).optional().default(null).custom((value, helpers) => {
  //     if (value === "") {
  //         return null;
  //     }
  //     return value;
  // }, 'Store null if password not provided'),
  password: Joi.string().min(6).optional(),
  name: Joi.string().required(),
  isAdmin: Joi.boolean().optional(),
  mujid: Joi.string().required(), // Add mujid to the validation schema
});

export async function POST(req) {
  try {
    // Parse the request body
    const { email, password, name, isAdmin, mujid } = await req.json();

    // Validate admin user data
    const { error } = adminSchema.validate({
      email,
      password,
      name,
      isAdmin,
      mujid,
    });
    if (error) {
      console.error("Validation error:", error.details[0].message);
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email, isAdmin: true });
    if (existingAdmin) {
      // console.error("User already exists:", email);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    // Hash the password if it exists
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create a new admin user
    const newAdmin = new User({
      email,
      password: password ? hashedPassword : undefined,
      name,
      isAdmin: isAdmin === true,
      mujid,
      isPasswordEmpty: !password,
    });
    await newAdmin.save();

    console.log("User added successfully:", email);
    return NextResponse.json(
      { message: "User added successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error details:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Ensure database connection
    await connect();

    // Fetch all admin users
    const admins = await User.find({ isAdmin: true });
    const users = await User.find({ isAdmin: false });
    return NextResponse.json({ admins, users }, { status: 200 });
  } catch (err) {
    // console.error("Error details:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    // Parse the request body
    const { email, password, name, mujid } = await req.json();

    // Check if the admin user exists
    const existingAdmin = await User.findOne({ email });
    if (!existingAdmin) {
      // console.error("Admin user not found:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the admin user
    existingAdmin.password = hashedPassword;
    existingAdmin.name = name;
    existingAdmin.mujid = mujid;
    existingAdmin.isPasswordEmpty = !password; // Update isPasswordEmpty based on the presence of the password
    await existingAdmin.save();
    // console.log("User updated successfully:", email);
    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    // console.error("Error details:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    // Parse the request body
    const { email } = await req.json();

    // Check if the admin user exists
    const existingAdmin = await User.findOne({ email });
    if (!existingAdmin) {
      // console.error("Admin user not found:", email);
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Delete the admin user
    await User.deleteOne({ email });
    // console.log("Admin user deleted successfully:", email);
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    // console.error("Error details:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
