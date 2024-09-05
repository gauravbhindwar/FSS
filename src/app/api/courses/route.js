const mongoose = require('mongoose');
const { Faculty, Course } = require('./models'); // Adjust the path as necessary

mongoose.connect('mongodb://localhost:27017/yourdbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function GET(req) {
  try {
    const faculties = await Faculty.find().populate('courses');
    return new Response(JSON.stringify(faculties), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name } = await req.json();
    const faculty = new Faculty({ name });
    await faculty.save();
    return new Response(JSON.stringify(faculty), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}