//-----------------------------
//#region Database Connection
//-----------------------------
import path = require("path");
import { Request, Response } from 'express';
import * as sqlite3 from "sqlite3";
const sqlite = sqlite3.verbose();
const dbFile = path.resolve("foo.db");
//const dbFile = path.join("intro-to-sqlite", "foo.db");
// below is the line for vanilla ES6 js to work; not necessary with typescript
// const dbFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "foo.db");
const db = new sqlite.Database(dbFile, (error) => {
  if (error) return console.error(error.message);
  console.log(`Connected to database ${dbFile}`);
});

//#endregion Database Connection

//-----------------------------
//#region Routes
//-----------------------------
/**
 * Gets a single user by id
 */
export const getUserById = (request: Request, response: Response) => {
  // Parse the id to generate a SQLite query
  const id = parseInt(request.params.id);
  const query = `SELECT * FROM user WHERE id = ?`;


  // db.get will replace all ? in query sequentially with
  // items from the array passed as the second parameter
  // and then run the callback function passed as the third param
  // What does the callback function do? 

  db.get(query, [id], (error, result) => {
    if (error) {
      console.error(error.message);
      response.status(400).json({ error: error.message });
      return;
    }
    // If nothing is returned, then result will be undefined
    if (result) {
      response.json(result);
    } else {
      response.sendStatus(404);
    }
  });
};

// ----- FILL IN BELOW -----
// Write and export the rest of the functions needed by index.js!

export const getAllUsers = (request: Request, response: Response) => {
  const query = 'SELECT * FROM user';

  db.all(query, [], (error, result) => {
    if (error) {
      console.error(error.message);
      response.status(400).json({ error: error.message });
      return;
    }
    // "all" callback will return an empty array if no results returned
    if (result.length > 0) {
      response.json(result);
    } else {
      response.sendStatus(404);
    }
  });
};

export const createUser = (request: Request, response: Response) => {

  const { id, name } = request.body;
  const query = 'INSERT INTO user (id, name) VALUES (?, ?) ';

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
    } else {
      response.sendStatus(404);
    }
  });

}

export const updateUserName = (request: Request, response: Response) => {

  const id = parseInt(request.params.id);
  const { name } = request.body;

  const query = 'UPDATE user SET name = ? WHERE id = ?';

  db.run(query, [name, id], function (error) {
    if (error) {
      console.error(error.message);
      return response.status(400).json({ error: error.message });
    }

    if (this.changes > 0) {
      response.json({ name });
    } else {
      response.sendStatus(404);
    }
  });
};

export const deleteUser = (request: Request, response: Response) => {

  const id = parseInt(request.params.id);

  const query = 'DELETE FROM user WHERE id = ?';

  db.run(query, [id], function (error) {
    if (error) {
      console.error(error.message);
      return response.status(400).json({ error: error.message });

    }

    if (this.changes > 0) {
      response.json({message: "User deleted"});
    } else {
      response.sendStatus(404);
    }
  });
};


