import { connect } from "@/app/dbConfig/dbConfig";
import { User, Admin } from "@/lib/dbModels/dbModels";
import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';

// Connect to the database
await connect();

// Define the schema for admin user validation
const adminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  isAdmin: Joi.boolean().required(),
  mujid: Joi.string().required() // Add mujid to the validation schema
});

export async function POST(req) {
  try {
    // Parse the request body
    const { email, password, name, isAdmin, mujid } = await req.json();

    // Validate admin user data
    const { error } = adminSchema.validate({ email, password, name, isAdmin, mujid });
    if (error) {
      console.error('Validation error:', error.details[0].message);
      return NextResponse.json({ error: error.details[0].message }, { status: 400 });
    }

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email, isAdmin: true });
    if (existingAdmin) {
      console.error('Admin user already exists:', email);
      return NextResponse.json({ error: 'Admin user already exists' }, { status: 400 });
    }

    // Create a new admin user
    const newAdmin = new User({ 
      email, 
      password, 
      name, 
      isAdmin:true, 
      mujid, 
      isPasswordEmpty: !password,
    });
    await newAdmin.save();

    // Update isPasswordEmpty in the database
  
    console.log('Admin user added successfully:', email);
    return NextResponse.json({ message: 'Admin user added successfully' }, { status: 201 });
  } catch (err) {
    console.error('Error details:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    // Ensure database connection
    await connect();

    // Fetch all admin users
    const admins = await User.find({ isAdmin: true });
    return NextResponse.json(admins, { status: 200 });
  } catch (err) {
    console.error('Error details:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    // Parse the request body
    const { email, password, name, mujid } = await req.json();

    // Check if the admin user exists
    const existingAdmin = await User.findOne({ email, isAdmin: true });
    if (!existingAdmin) {
      console.error('Admin user not found:', email);
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Update the admin user
    existingAdmin.password = password;
    existingAdmin.name = name;
    existingAdmin.mujid = mujid;
    existingAdmin.isPasswordEmpty = !password; // Update isPasswordEmpty based on the presence of the password
    await existingAdmin.save();
    console.log('Admin user updated successfully:', email);
    return NextResponse.json({ message: 'Admin user updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error details:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    // Parse the request body
    const { email } = await req.json();

    // Check if the admin user exists
    const existingAdmin = await User.findOne({ email, isAdmin: true });
    if (!existingAdmin) {
      console.error('Admin user not found:', email);
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Delete the admin user
    await User.deleteOne({ email, isAdmin: true });
    console.log('Admin user deleted successfully:', email);
    return NextResponse.json({ message: 'Admin user deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error details:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}