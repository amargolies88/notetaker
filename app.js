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
    // console.log("hello");
    console.log("api get req and res:")
    console.log(req.body);
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log("db.json:")
        console.log(data);
        res.json(JSON.parse(data));
    });
});

app.delete("/api/notes/:id", (req, res) => {
    console.log(req.params.id);
    let idToDelete = parseInt(req.params.id);
    let noteArray = [];

    fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
        if (err) throw err;
        console.log(`note id to delete: ${idToDelete}`);
        noteArray = JSON.parse(data);
        console.log("old note array:");
        console.log(noteArray);
        noteArray = noteArray.filter(obj => obj.id !== idToDelete);
        console.log(`new noteArray:`);
        console.log(noteArray);
        jsonNotes = JSON.stringify(noteArray);
        fs.writeFile(path.join(__dirname, "/db/db.json"), jsonNotes, (err) => {
            console.log(`wrote to db:`);
            console.log(jsonNotes);
            if (err) throw err;
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

app.post("/api/notes", function (req, res) {
    console.log("api post req.bodeh:");
    console.log(req.body);
    let newItem = req.body;
    let finalData = [];

    fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
        if (err) throw err;

        //Parse the json data
        finalData = JSON.parse(data);

        //look for available id and add to note property
        console.log(`final data length: ${finalData.length}`)
        if (finalData.length < 1) {
            newItem.id = 1;
        } else {
            for (let i = 1; i < finalData.length + 2; i++) {
                for (let j = 0; j < finalData.length; j++) {

                    //if this id exists break this loop and move to next id to check
                    if (i === finalData[j].id) {
                        break;
                    }

                    //if this is the last iteration and we made it here by passing all previous checks then
                    //the id is unique and we will use it
                    if (j === finalData.length - 1) {
                        newItem.id = i;
                    }
                }
                // if we set the id then we can stop checking for ids
                if (newItem.id) {
                    break;
                }
            }
        }

        finalData.push(newItem);
        let jsonData = JSON.stringify(finalData);

        //Save finalData as json in db.json
        fs.writeFile(path.join(__dirname, "/db/db.json"), jsonData, err => {
            if (err) throw err;
            console.log("wrote to database:");
            console.log(jsonData);
            res.send(newItem);
        });
    });
});


app.listen(PORT, function () {
    console.log("Listening on PORT " + PORT);
});
