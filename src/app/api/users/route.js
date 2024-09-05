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

// API route handler
export async function POST(req) {
  try {
    // Parse the request body
    const { email, password, action ,name} = await req.json();

    if(action === "addUser"){
      //validate user data
      const { error } = userSchema.validate({ email, password, name });
      if (error) {
        return NextResponse.json({ error: error.details[0].message }, { status: 400 });
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      // Create a new user
      const newUser = new User({ email, password, name });
      await newUser.save();

      return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
    }

    // Validate email
    const { error } = emailSchema.validate(email);
    if (error) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Please Contact Your Admin' }, { status: 404 });
    }

    // if (action == 'check') {
      // If user exists, check if the password is null
      if (user.password === null) {
        return NextResponse.json({ message: 'Password is not set. Please set a password.' }, { status: 200 },{password: false});
      } else {
        return NextResponse.json({ message: 'Password is set.' }, { status: 200 },{password: true});
      }
    // }

    if (action === 'setPassword') {
      // Set the password
      if (!password) {
        return NextResponse.json({ error: 'Password is required' }, { status: 400 });
      }

      // Hash the password before saving (replace this with hashing in production)
      user.password = password; // Consider using bcrypt to hash passwords
      await user.save();
      return NextResponse.json({ message: 'Password set successfully' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
