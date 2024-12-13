"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserName = exports.createUser = exports.getAllUsers = exports.getUserById = void 0;
//-----------------------------
//#region Database Connection
//-----------------------------
var path = require("path");
var sqlite3 = require("sqlite3");
var sqlite = sqlite3.verbose();
var dbFile = path.resolve("foo.db");
//const dbFile = path.join("intro-to-sqlite", "foo.db");
// below is the line for vanilla ES6 js to work; not necessary with typescript
// const dbFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "foo.db");
var db = new sqlite.Database(dbFile, function (error) {
    if (error)
        return console.error(error.message);
    console.log("Connected to database ".concat(dbFile));
});
//#endregion Database Connection
//-----------------------------
//#region Routes
//-----------------------------
/**
 * Gets a single user by id
 */
var getUserById = function (request, response) {
    // Parse the id to generate a SQLite query
    var id = parseInt(request.params.id);
    var query = "SELECT * FROM user WHERE id = ?";
    // db.get will replace all ? in query sequentially with
    // items from the array passed as the second parameter
    // and then run the callback function passed as the third param
    // What does the callback function do? 
    db.get(query, [id], function (error, result) {
        if (error) {
            console.error(error.message);
            response.status(400).json({ error: error.message });
            return;
        }
        // If nothing is returned, then result will be undefined
        if (result) {
            response.json(result);
        }
        else {
            response.sendStatus(404);
        }
    });
};
exports.getUserById = getUserById;
// ----- FILL IN BELOW -----
// Write and export the rest of the functions needed by index.js!
var getAllUsers = function (request, response) {
    var query = 'SELECT * FROM user';
    db.all(query, [], function (error, result) {
        if (error) {
            console.error(error.message);
            response.status(400).json({ error: error.message });
            return;
        }
        // "all" callback will return an empty array if no results returned
        if (result.length > 0) {
            response.json(result);
        }
        else {
            response.sendStatus(404);
        }
    });
};
exports.getAllUsers = getAllUsers;
var createUser = function (request, response) {
    var _a = request.body, id = _a.id, name = _a.name;
    var query = 'INSERT INTO user (id, name) VALUES (?, ?) ';
    db.run(query, [id, name], function (error) {
        if (error) {
            console.error(error.message);
            response.status(400).json({ error: error.message });
            return;
        }
        if (this.changes > 0) {
            response.json({
                id: id,
                name: name
            });
        }
        else {
            response.sendStatus(404);
        }
    });
};
exports.createUser = createUser;
var updateUserName = function (request, response) {
    var id = parseInt(request.params.id);
    var name = request.body.name;
    var query = 'UPDATE user SET name = ? WHERE id = ?';
    db.run(query, [name, id], function (error) {
        if (error) {
            console.error(error.message);
            return response.status(400).json({ error: error.message });
        }
        if (this.changes > 0) {
            response.json({ name: name });
        }
        else {
            response.sendStatus(404);
        }
    });
};
exports.updateUserName = updateUserName;
var deleteUser = function (request, response) {
    var id = parseInt(request.params.id);
    var query = 'DELETE FROM user WHERE id = ?';
    db.run(query, [id], function (error) {
        if (error) {
            console.error(error.message);
            return response.status(400).json({ error: error.message });
        }
        if (this.changes > 0) {
            response.json({ message: "User deleted" });
        }
        else {
            response.sendStatus(404);
        }
    });
};
exports.deleteUser = deleteUser;
