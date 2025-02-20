import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import https from "https";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";

// Handling Uncaught Errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Session Storage - Ensure `dbsessionstore` is properly configured
// const dbsessionstore = new session.MemoryStore(); // Replace this with actual store

// app.use(
//   session({
//     genid: () => genuuidv4(),
//     store: dbsessionstore,
//     secret: Appconfig.session_secret,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: true,
//       maxAge: 1000 * 60 * 60 * 24 * 60,
//       sameSite: "none",
//     },
//   })
// );

// Login Route
app.post("/login", async (req, res) => {
  const { phonenumber, password } = req.body;

  try {
    // const user = await Employeemodel.findOne({ phonenumber });
    // if (!user) {
    //   return res.status(400).json({ success: false, message: "Invalid phonenumber or password" });
    // }

    // const isMatch = bcrypt.compareSync(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ success: false, message: "Invalid phonenumber or password" });
    // }
    const user = {
      name: "John Doe",
      phonenumber: "1234567890",
    };

    const JWT_SECRET =
      "80e9aa72842a6808827a6dfe3279dbd4f681d18bcf941f189f096c3b87b6d5d153291af9a03e2ed75fee4e7249368369c2d1a60d60bb4be99b12281a3b163c4d1445a03013fd4d8b3987e4017b32f28bd98b993e4a9bd9af90c64d191be7fbb32e9f888f593eecb9c4e4726bafb3c7dba0e215790798ee48d0db19f37061034683c4fe62b40247c566125f27a8e1b74ba46c6153c93a946ea318ebffa382f32b07578709eb3432ad9f4093046a17d7cccfa08cf3d2b8d7cc7c45e8a3b4cb7d1bf2677e23dcb6992b714c353693c720abad7e137244100de8545064b5ff14a0925674b0a9344558c64fe1e7c1a39e1b9a49d52695c63d7c65b2b25a8b19754dcef42760e5009e03f6bc8e7dda69e0a347f26066ad8bcfb21d38a31ba6c2d06637035b642f636a1e1dbab9b6ff9279994a5aaf60df5f879d838fdd13ebc188c0da0271642bcf24441d015c1ddd1c76ac90badbe133fbe03ee402f893c448b638e5c750ff595499d16f9513e4ca38ca3f8a29114c88b1d7c4ddeb569560f96c9ae2223b2ca6f0abc5a3fcfb4b42f0dbf0a861691b1b09956927f200a9c634a3d4ae47a80facfca91690800d5c61679288f80f57a946cdf9c839e6573ad54c9cb5a951df774faf5907e9fb401ef8e3a7a253724e2f3467878481493057430aaf01a8c76bcc305cfcfa735c65d1335ea85bc3226349816d311ea7cc86897ca879c8b2";

    const token = jwt.sign(
      { username: user.name, phone: user.phonenumber },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("authToken", token);

    res.json({ success: true, message:"login successfully" });
  } catch (error) {
    console.error("Employee login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Database Connection
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://devops:password420@cluster0.ybtsd.mongodb.net/Ceppl_Data",
      {
        retryWrites: true,
      }
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

connectToMongoDB();

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the backend");
});

// HTTPS Server Configuration
app.listen(8000, () => {
  console.log("Server running on port 8000");
});
