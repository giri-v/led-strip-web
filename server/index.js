const express = require("express");
const morgan = require("morgan");
const logger = require("./logger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//////////////////////////////////////////////////////
//
//  ALL USER requireS HERE
//




////////////////////////////////////////////////////////



//const database = require('./database');
const api = require("./api/v1");

// Connect to database
//database.connect();

// Initialize Express app
const app = express();

// Setup logging stream object
const stream = {
  write: (message) => {
    logger.info(message);
  },
};

var angularDir = __dirname.replace("server", "client") + "/app";

// Setup middleware with logging to stream object
app.use(morgan("combined", { stream }));

// parse application/x-www-form-urlencoded
// Need this to extract username/password from login form
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
// Need this to parse initial token (I think)
app.use(bodyParser.json());

app.use(cookieParser());


//////////////////////////////////////////////////////
//
//  ALL USER CODE HERE
//
////////////////////////////////////////////////////////


const serveApp = (req, res, next) => {
  if (req.originalUrl === "/") {
    req.originalUrl += "index.html";
    res.sendFile(
      __dirname.replace("server", "client") + "/app" + req.originalUrl
    );
  } else {
    logger.debug(" Trying to send file: " + req.originalUrl);
    res.sendFile(
      __dirname.replace("server", "client") + "/app" + req.originalUrl
    );
  }
};

const serveFiles = (req, res, next) => {
  var tag1 = req.originalUrl;
  logger.debug("Checking for app file serving...");
  logger.debug("    " + tag1);
  if (tag1.indexOf(".") > 0 && tag1.indexOf("/") == tag1.lastIndexOf("/")) {
    logger.debug("    Sending app resource file.");
    res.sendFile(
      __dirname.replace("server", "client") + "/app" + req.originalUrl
    );
  } else {
    logger.debug("    Not a file request. Moving on.");
    next();
  }
};

app.route("/")
  .get(express.static(angularDir));



// Setup router and routes
app.use("/",  express.static(angularDir), api);
app.use("/api/v1",  api); // To allow API version support

/////////////////////////////////////
// ERROR HANDLING
////////////////////////////////////

// Handle middleware errors
app.use((req, res, next) => {
  const message = "Resource not found" + req.originalUrl;
  logger.warn(message);
  res.status(404);
  res.json({
    error: true,
    message
  });
});

app.use((err, req, res, next) => {
  let { statusCode = 500 } = err;
  const { message } = err;

  // Validation Errors
  if (err.message.startsWith("ValidationError")) {
    statusCode = 422;
  }

  logger.error(`Error: ${message}`);
  res.status(statusCode);
  res.json({
    error: true,
    statusCode,
    message
  });
});

module.exports = app;
