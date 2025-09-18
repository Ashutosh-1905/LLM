import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpiry });
};

export default generateToken;