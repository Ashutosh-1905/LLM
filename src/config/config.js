import { config as conf } from "dotenv";
conf();

const _config = {
    env: process.env.NODE_ENV,
    port: process.env.SERVER_PORT,
    databaseUrl: process.env.MONGODB_URI,
    frontendUrl: process.env.FRONTEND_URL,

    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY,

    cloudinaryUrl: process.env.CLOUDINARY_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

    smptHost: process.env.SMTP_HOST,
    smptPort: process.env.SMTP_PORT,
    smptUsername: process.env.SMTP_USERNAME,
    smptPassword: process.env.SMTP_PASSWORD,
    smptFromEmail: process.env.SMTP_FROM_EMAIL,

    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpaySecret: process.env.RAZORPAY_SECRET,
    razorpayPlanId: process.env.RAZORPAY_PLAN_ID,



};

const config = Object.freeze(_config);

export default config;
