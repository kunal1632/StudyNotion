const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/ContactUs");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
dotenv.config();

const PORT = process.env.PORT || 4000;
// database connect
database.connect();
// middleware
app.use(express.json());
app.use(cookieParser());
// Define a list of allowed origins
const allowedOrigins = [
  "https://study-notion-divek.vercel.app",
  "https://www.study-notion-divek.vercel.app",
  "http://localhost:3000",
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Use the CORS middleware with the configured options
app.use(cors(corsOptions));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/reach", contactUsRoute);

// def route
app.get("/", (req, res) => {
  return res.json({ success: true, message: "Your server is up and running" });
});

app.listen(PORT, () => {
  console.log(`app is running at port ${PORT}`);
});
