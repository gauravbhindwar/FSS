import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    mujid: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (value) {
                const user = await this.constructor.findOne({ mujid: value });
                if (user && user.id !== this.id) {
                    throw new Error('mujid already exists');
                }
                return true;
            },
            message: props => 'The specified mujid is already in use'
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
                    throw new Error('email already exists');
                }
                return true;
            },
            message: props => 'The specified email address is already in use'
        },
    },
    password: {
        type: String
    },
    ext: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false,
        validate: {
            validator: async function (value) {
                const user = await this.constructor.findOne({ phone: value });
                if (user && user.id !== this.id) {
                    throw new Error('phone already exists');
                }
                return true;
            },
            message: props => 'The specified phone number is already in use'
        }
    },
    designation: {
        type: String,
        // required: true
    },
    role: {
        type: String,
        // required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    forSemester: {
        type: String,
        required: true
    },
    program: {
        type: String,
    },
    courseClassification: {
        type: String,
        enum: ['THEORY', 'LAB', 'THEROY-LAB', 'PROJECT', 'SEMINAR']
        // required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    courseCredit: {
        type: String,
        required: true
    },
    courseType: {
        type: String,
        enum: ['CORE', 'ELECTIVE']
        // required: true
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export { User, Course };
