import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import BlacklistToken from "../../models/BlacklistToken.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";
import User from "../../models/User.js";

// A single, robust authentication middleware
const isLoggedIn = catchAsync(async (req, res, next) => {
    const token = req.cookies.token || (req.header("Authorization") && req.header("Authorization").split(" ")[1]);

    if (!token) {
        return next(new AppError("Not logged in, please log in to get access.", 401));
    }

    const isTokenBlacklisted = await BlacklistToken.findOne({ token });
    if (isTokenBlacklisted) {
        return next(new AppError("Invalid token. Token has been blacklisted.", 401));
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
        return next(new AppError("User not found.", 404));
    }

    req.user = user;
    next();
});

const authorizedRoles = (...roles) => (req, res, next) => {
    const currentUserRole = req.user.role;
    if (!roles.includes(currentUserRole)) {
        return next(new AppError("You do not have permission to access this route.", 403));
    }
    next();
};

const authorizeSubscriber = catchAsync(async (req, res, next) => {
    const { role, id } = req.user;
    const user = await User.findById(id);
    const subscriptionStatus = user.subscription.status;
    if (role !== 'ADMIN' && subscriptionStatus !== 'active') {
        return next(new AppError('Please subscribe to access this route!', 403));
    }
    next();
});

export {
    isLoggedIn,
    authorizedRoles,
    authorizeSubscriber
};