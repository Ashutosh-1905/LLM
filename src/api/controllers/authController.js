import {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
} from '../services/userService.js';
import catchAsync from "../../utils/catchAsync.js";

const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'Lax'
};

const register = catchAsync(async (req, res, next) => {
    const { fullName, email, password } = req.body;
    const avatar = req.file;
    const { user, token } = await registerUser(fullName, email, password, avatar);
    
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user,
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        user,
    });
});

const logout = catchAsync(async (req, res, next) => {
    const token = req.cookies.token;
    await logoutUser(token);
    
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    });
});

const getUserProfile = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    const user = await getProfile(id);

    res.status(200).json({
        success: true,
        message: 'User details',
        user
    });
});

const handleForgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    await forgotPassword(email);

    res.status(200).json({
        success: true,
        message: `Reset password token has been sent to ${email}`,
    });
});

const handleResetPassword = catchAsync(async (req, res, next) => {
    const { resetToken } = req.params;
    const { password } = req.body;
    
    await resetPassword(resetToken, password);

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
});

const handleChangePassword = catchAsync(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    await changePassword(id, oldPassword, newPassword);

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
});

const handleUpdateUser = catchAsync(async (req, res, next) => {
    const { fullName } = req.body;
    const { id } = req.user;
    const avatar = req.file;

    const updatedUser = await updateUser(id, fullName, avatar);

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser
    });
});

export {
    register,
    login,
    logout,
    getUserProfile,
    handleForgotPassword,
    handleResetPassword,
    handleChangePassword,
    handleUpdateUser
};