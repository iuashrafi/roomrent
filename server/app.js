const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const cookieParser = require("cookie-parser");

// models
const User = require("./models/User.js");

// importing routes
const AuthRoutes = require("./routes/AuthRoutes.js");
const BookingRoutes = require("./routes/BookingRoutes.js");
const PlacesRoutes = require("./routes/PlacesRoutes.js");
const ProfileRoutes = require("./routes/ProfileRoutes.js");
const SearchRoutes = require("./routes/SearchRoutes.js");

// middlewares
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/test", (req, res) => {
  res.json("hello world");
});

// registering routes
app.use("/api/auth", AuthRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/places/", PlacesRoutes);
app.use("/api/profile", ProfileRoutes);
app.use("/api/search", SearchRoutes);

app.get("/url", (req, res) => {
  const protocol = req.protocol;
  const host = req.hostname;
  const url = req.originalUrl;
  const port = process.env.PORT || 4000;

  const fullUrl = `${protocol}://${host}:${port}${url}`;

  const responseString = `Full URL is: ${fullUrl}`;
  res.send(responseString);
});

// cookie testing
app.post("/set-cookie", (req, res) => {
  res
    .cookie("testing", "success", {
      httpOnly: true,
      sameSite: "none",
    })
    .send("Cookie set successfully");
});

app.get("/get-cookie", (req, res) => {
  const name = req.cookies.testing;
  res.send(`Value of test cookie is: ${name}`);
});

app.get("/api/profile", (req, res) => {
  const { token } = req.cookies;
  console.log("cookies=", req.cookies);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      console.log({ name, email, _id });
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }

  res.json(uploadedFiles);
});

// payments
const stripe = require("stripe")("sk_test_tR3PYbcVNZZ796tH88S4VQ2u");

app.post("/create-checkout-session", async (req, res) => {
  console.log("inside create checkout session !");

  const YOUR_DOMAIN = "http://localhost:5173";

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          unit_amount: 2000,
          product_data: {
            name: "T-shirt",
          },
          currency: "usd",
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    // success_url: `${YOUR_DOMAIN}?success=true`,
    success_url: `${YOUR_DOMAIN}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  console.log("stripe session = ", session);
  // res.redirect(303, session.url);
  res.status(200).json({ url: session.url }); // Send session URL back to client
});

app.get("/payment/success", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);

  res.send(
    `<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`
  );
});
module.exports = app;
