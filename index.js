"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//-----------------------------
// #region Setup
//-----------------------------
var express = require("express");
var db = require("./db");
var app = express();
var PORT = 4000;
//#endregion Setup
//-----------------------------
//#region App Config
//-----------------------------
// https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
// Middleware that parses POST / PUT requests from a client
app.use(express.json());
// Handle CORS w/ client
// For more information about CORS (Cross-Origin Resource Sharing):
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(function (req, res, next) {
    // Allow access from multiple origins
    var allowedOrigins = [
        "http://localhost:8080",
    ];
    var origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    // Allow specific requests
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    // Pass to next layer of middleware
    next();
});
//#endregion App Config
//-----------------------------
//#region Database Routes
//-----------------------------
app.get("/", function (req, res) {
    res.json({ info: "Demo app for sqlite3" });
});
// This endpoint allows a client to get a single user by id
app.get("/user/:id", db.getUserById);
// ------ FILL IN BELOW -------
// Write endpoints that allow a client to:
// Get all users
app.get("/user", db.getAllUsers); //done
// Create a new user
app.post("/user", db.createUser);
// Update a user's name, given an id
app.put("/user/:id", db.updateUserName);
// Delete a user by id
app.delete("/user/:id", db.deleteUser);
//#endregion Database Routes
//-----------------------------
//#region Server
//-----------------------------
app.listen(PORT, function () {
    console.log("Listening on port http://localhost:".concat(PORT));
});
//#endregion Server
