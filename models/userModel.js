const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const { profileColors } = require('../config/constants')


const userSchema = new mongoose.Schema(
    {
        accountType: {
            type: String,
            enum: ['google', 'email'],
            default: 'email'
        },
        firstName: {
            type: String, 
            required: [true, "First name is a mandatory field"],
            maxlength: [25, "First name length must be less than 25"],
            min: [2, "First name length must be greater than 2"],
        },
        lastName: {
            type: String, 
            required: [true, "Last name must be a mandatory filed"],
            max: [25, "Last name length must be less than 25"],
            min: [1, "Last name length must be greater than 1"],
        },
        email: {
            type: String, 
            required: [true, "Email is a mandatory field"],
            unique: true,
            lowercase: true
        },
        password: {
            type: String, 
            required: function() {
                return this.accountType === 'email';
            },
            select: false, 
            max: 25,
        },
        profile: {
            type: String, 

        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        tenantId: {
            type: String,
            select: false,
            required: function() {
                return this.role === "user"
            }
        },
        profile: {
            letter: { type: String },
            background: { type: String },
            color: { type: String },
        },
    },
    {
        collection: 'users'
    },
    {
        timestamps: true,
    }
)

userSchema.pre("save", function(next) {
    const user = this

    if (!user.profile || !user.profile.letter) {
        const firstLetter = user.firstName.charAt(0).toUpperCase();
        const randomColor = profileColors[Math.floor(Math.random() * profileColors.length)];

        user.profile = {
            letter: firstLetter,
            background: randomColor.background,
            color: randomColor.color,
        };
    }


    if(!user.isModified('password')) return next()    // checks if the password is changed or not 

    bcrypt.genSalt(10, (error, salt) => {
        if(error) return next(error)

        bcrypt.hash(user.password, salt, (error, hash) => {
            if(error) return next(error)

            user.password = hash 
            next()
        })
    })
})

userSchema.methods.generateAccessJWT = function() {
    let payload = {id: this._id}

    return jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: '30d'})
}

module.exports = mongoose.model.users || mongoose.model("users", userSchema)

