import mongoose from "mongoose";
import { type } from "os";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    mujid: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (value) {
          const user = await this.constructor.findOne({ mujid: value });
          if (user && user.id !== this.id) {
            throw new Error("mujid already exists");
          }
          return true;
        },
        message: (props) => "The specified mujid is already in use",
      },
    },
    name: {
      type: String,
      // required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (value) {
          const user = await this.constructor.findOne({ email: value });
          if (user && user.id !== this.id) {
            throw new Error("email already exists");
          }
          return true;
        },
        message: (props) => "The specified email address is already in use",
      },
    },
    password: {
      type: String,
    },
    ext: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
      validate: {
        validator: async function (value) {
          const user = await this.constructor.findOne({ phone: value });
          if (user && user.id !== this.id) {
            throw new Error("phone already exists");
          }
          return true;
        },
        message: (props) => "The specified phone number is already in use",
      },
    },
    designation: {
      type: String,
      // required: true
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    jwtSecretKey: {
      type: String,
    },
    tokenUsed: { type: Boolean, default: false },
    tokenExpiry: { type: Date },

    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

let Admin;
if (mongoose.models.Admin) {
  Admin = mongoose.models.Admin;
} else {
  Admin = User.discriminator(
    "Admin",
    new Schema({
      // Admin specific fields
    })
  );
}

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: "Description Not Added",
    },
    forSemester: {
      type: String,
      required: true,
    },
    isEven: {
      type: Boolean,
    },
    courseClassification: {
      type: String,
      enum: ["THEORY", "LAB"],
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    courseCredit: {
      type: String,
      required: true,
    },
    courseType: {
      type: String,
      enum: ["CORE", "ELECTIVE"],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export { User, Admin, Course };
