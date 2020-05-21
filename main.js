const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
require("dotenv").config();
const router = express.Router();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const portNum = process.env.PORT || 5000;

//Middelwares
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//bodyparser
app.use(express.urlencoded({ extended: false }));

//passport config
require("./auth/passport")(passport);

//Mongoose
mongoose
  .connect(process.env.MONGO_URI, options)
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.Promise = global.Promise;

//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect-flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

app.listen(portNum, () => {
  console.log(`Server up and runing!!! at port ${portNum}`);
});
