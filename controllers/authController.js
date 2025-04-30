import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }


        if (password.length < 6) {
            return res.status(400).json({ message: "Password length must be at least 6 characters" })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "email already exists" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            const token = generateToken(newUser._id);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                token
            })
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }

    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      console.log("Login attempt:", email);
  
      const user = await User.findOne({ email });
  
      if (!user) {
        console.log(" No user found with email");
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
      if (!isPasswordCorrect) {
        console.log(" Password incorrect");
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = generateToken(user._id);
  
      console.log(" Login successful for user:", user._id);
  
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        token,
      });
    } catch (error) {
      console.error("Error in login controller:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ message: "internal Server error" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id

        if (!profilePic) {
            res.status(400).json({ message: "Profile pic is required" })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log('Error in update profile', error.message);
        res.status(500).json({ message: "internal Server error" })
    }
}

export const checkAuth = async(req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log('Error in checkAuth Controller',error.message)
        res.status(500).json({message:"Internal server error"})
    }
}
