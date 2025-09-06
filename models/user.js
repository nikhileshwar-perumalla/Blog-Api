import { Schema, model } from 'mongoose';

// Converted to valid Mongoose schema (kept original messages & field names)
const userschema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'], // original message
        maxlength: [20, 'Max length is 20 brother'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is reqired boss'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is must man '],
        maxlength: [20, 'No way you are remembering this'],
        select: false
    },
    role: {
        type: String,
        required: [true, 'u are a user or admin slect one '],
        enum: {
            values: ['admin', 'user'],
            message: '{VALUE} is not supported'
        },
        default: 'user'
    },
    firstname: {
        type: String,
        required: [true, 'Firstname likho bhai'],
        maxlength: [20, 'are you mad what  is that first name']
    },
    lastname: {
        type: String,
        required: [true, 'lastname likho bhai'],
        maxlength: [20, 'are you mad what  is that last name']
    },
    sociallinks: {
        website: { type: String, maxlength: [100, 'Gimme the site links bro'] },
        facebook: { type: String, maxlength: [100, 'Gimme the fb links bro'] },
        instagram: { type: String, maxlength: [100, 'Gimme the  insta links bro'] },
        linkedin: { type: String, maxlength: [100, 'Gimme the  linked in links bro'] },
        x: { type: String, maxlength: [100, 'Gimme the  X links bro'] },
        youtube: { type: String, maxlength: [100, 'Gimme the YT links bro'] }
    }
}, { timestamps: true });

export default model('user', userschema);
