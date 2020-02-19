const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 8808;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API ROUTES
app.get("/api/notes", function (req, res) {
    console.log("hello");
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        return res.send(data);
    });


    // res.sendFile(path.join(__dirname, "/public/index.html"));
});

// ROUTES
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/api/:id", function (req, res) {
    let id = req.params.id;
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    const newCharacter = req.body;

    // Using a RegEx Pattern to remove spaces from newCharacter
    // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
    newCharacter.routeName = newCharacter.name.replace(/\s+/g, "").toLowerCase();

    console.log(newCharacter);

    characters.push(newCharacter);

    res.json(newCharacter);
});



app.listen(PORT, function () {
    console.log("Listening on PORT " + PORT);
});
