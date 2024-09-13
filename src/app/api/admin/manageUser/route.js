import { connect } from "../../../helper/dbConfig";
import { Course, Form, Term, User } from "../../../../lib/dbModels/dbModels";
import { NextResponse, NextRequest } from "next/server";
import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  mujid: Joi.string().required(),
  isAdmin: Joi.boolean().optional(),
  password: Joi.string().min(6).optional(),
  token: Joi.string().optional(),
});

// Utility function to handle errors
const createErrorResponse = (message, statusCode = 400) => {
  return NextResponse.json({ error: message }, { status: statusCode });
};

export async function POST(NextRequest) {
  try {
    await connect();

    // Parse request body
    let requestBody;
    try {
      requestBody = await NextRequest.json();
    } catch (err) {
      return createErrorResponse("Invalid JSON input");
    }

    const { email, name, isAdmin, mujid } = requestBody;

    const { error } = userSchema.validate({ email, name, mujid, isAdmin });
    if (error) {
      return createErrorResponse(error.details[0].message);
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return createErrorResponse(
        "Can't use same email or mujid! User already exists"
      );
    }

    const newUser = await new User({
      email,
      name,
      isAdmin,
      mujid,
    });

    try {
      await newUser.save();
    } catch (error) {
      // console.error("Error saving new user:", error);
      return createErrorResponse("Error saving new user", 500);
    }

    const message = isAdmin
      ? "Admin Added successfully"
      : "User Added successfully";

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    // Catch any unexpected errors and return a generic message
    // console.error(error);
    return createErrorResponse("Something went wrong on the server", 500);
  }
}

export async function GET() {
  await connect();
  try {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    const activeCourses = await Course.countDocuments();
    const formSubmissions = await Form.countDocuments();
    const currentTerm = await Term.findOne({});
    const currentAdmin = await User.findOne({
      isAdmin: true,
    });
    const adminName = currentAdmin.name;
    console.log(adminName);

    // console.log(currentTerm.forTerm);
    const forTerm = currentTerm.forTerm;
    const semestersInCurrentTerm = currentTerm.semestersInCurrentTerm;
    console.log(
      totalUsers,
      activeCourses,
      formSubmissions,
      forTerm,
      semestersInCurrentTerm
    );
    return NextResponse.json(
      {
        users,
        totalUsers,
        activeCourses,
        formSubmissions,
        forTerm,
        semestersInCurrentTerm,
        adminName,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json("Failed to fetch user", 500);
  }
}

export async function DELETE(req) {
  try {
    await connect();

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (err) {
      return createErrorResponse("Invalid JSON input");
    }

    const { mujid } = requestBody;

    if (!mujid) {
      return createErrorResponse("mujid is required for deletion");
    }

    // Delete the user
    const deletedUser = await User.findOneAndDelete({ mujid });

    if (!deletedUser) {
      return createErrorResponse("User not found", 404);
    }

    return NextResponse.json(
      { message: "User deleted successfully", deletedUser },
      { status: 200 }
    );
  } catch (error) {
    // console.error(error);
    return createErrorResponse("Failed to delete user", 500);
  }
}
