import User from '../../models/User.js';
import BlacklistToken from '../../models/BlacklistToken.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import cloudinary from 'cloudinary';
import AppError from "../../utils/AppError.js";
import sendEmail from "../../utils/sendEmail.js";
import config from "../../config/config.js";
import generateToken from '../../utils/generateToken.js'; // <-- Import the utility

const registerUser = async (fullName, email, password, avatarFile) => {
    const userExist = await User.findOne({ email });
    if (userExist) {
        throw new AppError("Email already exists, please login", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
        avatar: {
            public_id: email, // Placeholder public_id
            secure_url: "",
        },
    });

    if (!newUser) {
        throw new AppError("User registration failed, please try again", 400);
    }

    if (avatarFile) {
        try {
            const result = await cloudinary.v2.uploader.upload(
                `data:${avatarFile.mimetype};base64,${avatarFile.buffer.toString('base64')}`, // <-- Correct way to upload from memory
                {
                    folder: "Learning-Management-System",
                    width: 250,
                    height: 250,
                    gravity: "faces",
                    crop: "fill",
                }
            );

            if (result) {
                newUser.avatar.public_id = result.public_id;
                newUser.avatar.secure_url = result.secure_url;
            }
        } catch (e) {
            throw new AppError(e.message || "File not uploaded, please try again", 500);
        }
    }

    await newUser.save();
    const token = generateToken(newUser._id); // <-- Use the imported utility
    newUser.password = undefined;

    return { user: newUser, token };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Email or Password does not match', 400);
    }

    const token = generateToken(user._id); // <-- Use the imported utility
    user.password = undefined;

    return { user, token };
};

const logoutUser = async (token) => {
    if (token) {
        await BlacklistToken.create({ token });
    }
};

const getProfile = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
};

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError('Email not registered', 400);
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetPasswordURL = `${config.frontendUrl}/user/profile/reset-password/${resetToken}`;
    const subject = 'Reset Password';
    const message = `You can reset your password by clicking here: ${resetPasswordURL}\n\nIf you have not requested this, kindly ignore.`;

    try {
        await sendEmail(email, subject, message);
    } catch (e) {
        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;
        await user.save();
        throw new AppError(e.message, 500);
    }
};

const resetPassword = async (resetToken, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new AppError("Token is invalid or expired, please try again", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();
};

const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) {
        throw new AppError("User does not exist", 400);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new AppError("Invalid old password", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
};

const updateUser = async (userId, fullName, avatarFile) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User does not exist", 400);
    }

    if (fullName) {
        user.fullName = fullName;
    }

    if (avatarFile) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        try {
            const result = await cloudinary.v2.uploader.upload(
                `data:${avatarFile.mimetype};base64,${avatarFile.buffer.toString('base64')}`, // <-- Correct way to upload from memory
                {
                    folder: 'Learning-Management-System',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill'
                }
            );

            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
            }
        } catch (e) {
            throw new AppError(e.message || 'File not uploaded, please try again', 500);
        }
    }

    await user.save();
    return user;
};

export {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
};