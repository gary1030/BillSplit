var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var prisma = require("./prisma");
const cors = require("cors");
const oapi = require("./config/openapi");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var groupRouter = require("./routes/group");
var categoryRouter = require("./routes/category");
var currencyRouter = require("./routes/currency");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

prisma
  .connect()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }); // Add closing parenthesis here

app.use(oapi);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/groups", groupRouter);
app.use("/categories", categoryRouter);
app.use("/currencies", currencyRouter);
app.use("/swaggerui", oapi.swaggerui());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
