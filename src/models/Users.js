import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profileImage: {
        type: String,
        default: ""
    }
}, {timestamps:true});

//Hash the password before saving the user to db
userSchema.pre("save", async function () { //do not use arrow function here
    if (!this.isModified("password")) return ; // ex scenario: if user wants to change username not password so we dont need to rehash the password

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
})

//Compare password func
userSchema.methods.comparePassword = async function (userPassword) {
     return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;