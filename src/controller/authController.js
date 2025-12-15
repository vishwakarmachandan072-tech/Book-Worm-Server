import bcrypt from 'bcryptjs';
import User from '../models/Users.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" }); //expiress in 15 days
}

const postRegister = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        //Form Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required. " });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Passwoord should be atleast 6 characters long. " });
        }

        if (username.length < 6) {
            return res.status(400).json({ message: "Username should be atleast 3 characters long. " });
        }

        //Check if user exists or not
        const existingUsername = await User.findOne({ username }); //User.findOne({ username: username })
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email }); //User.findOne({ email: email })
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        //get random avatars
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        //creating new user
        const user = new User({
            username,
            email,
            password,
            profileImage,
        });

        //Saving new user created
        await user.save();

        //Generating the JWT token
        const token = generateToken(user._id);

        //sending response to user
        res.status(201).json({
            token,
            user: { //we dont want to send password hence did not sent whole user
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            }
        })

    } catch (error) {
        console.log("Error registering user: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //Form validation
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are requied" });
        }

        //Check if user exists or not
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //Check if password is correct or not
        const isPasswordCorrect = await existingUser.comparePassword(password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials " });

        //Generate the token
        const token = await generateToken(existingUser._id);

        res.status(200).json({
            token,
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                profileImage: existingUser.profileImage,
                createdAt: existingUser.createdAt,
            }
        });

    } catch (error) {
        console.log("Error Loggin in: ", error);
        res.status(500).json({ message: "Internal server error " });
    }


}


const authController = {
    postRegister,
    postLogin
};

export default authController;