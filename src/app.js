import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./api/routes/userRoutes.js"
import globalErrorHandler from "./api/middlewares/globalErrorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "welcome to LLM."
    });
});

app.use(globalErrorHandler);

export default app;