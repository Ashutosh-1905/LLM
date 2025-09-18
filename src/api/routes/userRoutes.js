import { Router } from "express";
const router = Router();

import { 
 
    handleForgotPassword, 
    getUserProfile, 
    login, 
    logout, 
    register, 
    handleResetPassword, 
    handleUpdateUser, 
    handleChangePassword
} from "../controllers/authController.js";

import upload from "../middlewares/multerMiddleware.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";

// Renamed controller functions for clarity
router.post('/register', upload.single("avatar"), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isLoggedIn, getUserProfile);
router.post('/forgot-password', handleForgotPassword);
router.post('/reset-password/:resetToken', handleResetPassword);
router.post('/change-password', isLoggedIn, handleChangePassword);
router.put('/update', isLoggedIn, upload.single("avatar"), handleUpdateUser); // Using PUT for updates and removing :id since we get it from req.user

export default router;