const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 8808;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));



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
        return res.json(data);
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
    let finalData = [];

    fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
        if (err) throw err;

        //Parse the json data and push req.body onto array finalData
        finalData = JSON.parse(data);
        finalData.push(req.body);
        let jsonData = JSON.stringify(finalData);

        //Save finalData as json in db.json
        fs.writeFile(path.join(__dirname, "/db/db.json"), jsonData, (err) => {
            if (err) throw err;
            console.log("wrote to database:");
            console.log(jsonData);
            return req.body;
        });
    });
});


app.listen(PORT, function () {
    console.log("Listening on PORT " + PORT);
});
