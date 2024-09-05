import { connect } from "@/app/dbConfig/dbConfig";
import { User } from "@/lib/dbModels/dbModels";
import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';

// Connect to the database
connect();

// Define the schema for email validation
const emailSchema = Joi.string().email().required();

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required()
});

// Function to check if the user's password is empty
async function checkPasswordEmpty(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  return user.isPasswordEmpty;
}
// API route handler
