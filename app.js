const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 8808;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

function findNewID() {

}

// API ROUTES
app.get("/api/notes", function (req, res) {
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


    // res.sendFile(path.join(__dirname, "/public/index.html"));
});

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

                    //if this id exists
                    if (i === finalData[j].id) {
                        break;
                    }

                    //on last iteration:
                    if (j === finalData.length - 1) {
                        console.log(`got here with id: ${i}`);
                        newItem.id = i;
                    }
                }
                if (newItem.id) {
                    break;
                }
            }
        }



        finalData.push(newItem);
        let jsonData = JSON.stringify(finalData);

        //Save finalData as json in db.json
        fs.writeFile(path.join(__dirname, "/db/db.json"), jsonData, (err) => {
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
