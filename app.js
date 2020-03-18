const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 8808;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// API ROUTES
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        res.json(JSON.parse(data));
    });
});

app.post("/api/notes", function (req, res) {
    let note = req.body;
    let notesArray = [];

    fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
        if (err) throw err;

        //Parse the json data
        notesArray = JSON.parse(data);

        //look for available id and add to note property
        if (notesArray.length < 1) {
            note.id = 1;
        } else {
            for (let i = 1; i < notesArray.length + 2; i++) {
                for (let j = 0; j < notesArray.length; j++) {

                    //if this id exists break this loop and move to next id to check
                    if (i === notesArray[j].id) {
                        break;
                    }

                    //if this is the last iteration and we made it here by passing all previous checks then
                    //the id is unique and we will use it
                    if (j === notesArray.length - 1) {
                        note.id = i;
                    }
                }
                // if we set the id then we can stop checking for ids
                if (note.id) {
                    break;
                }
            }
        }

        //add the new note to our array of notes
        notesArray.push(note);
        //convert array to json string and store
        let jsonData = JSON.stringify(notesArray);

        //save json data to db file
        fs.writeFile(path.join(__dirname, "/db/db.json"), jsonData, err => {
            if (err) throw err;
            res.send(note);
        });
    });
});

app.delete("/api/notes/:id", (req, res) => {
    let idToDelete = parseInt(req.params.id);
    let notesArray = [];
    fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
        if (err) throw err;
        //store parsed json data
        notesArray = JSON.parse(data);
        //remove object in array with matching id
        notesArray = notesArray.filter(obj => obj.id !== idToDelete);
        //convert back to json string
        jsonNotes = JSON.stringify(notesArray);
        //write json string back to db
        fs.writeFile(path.join(__dirname, "/db/db.json"), jsonNotes, (err) => {
            if (err) throw err;
            res.end();
        });
    });
})


// ROUTES
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});



app.listen(PORT, function () {
    console.log("Listening on PORT " + PORT);
});
