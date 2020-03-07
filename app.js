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
        console.log(data);
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

app.post("/api/notes", function (req, res) {
    console.log("api post req and res:");
    console.log(req.body);
    let finalData = [];
    console.log("type of finalData:");
    console.log(typeof finalData);

    fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
        if (err) throw err;
        console.log(data);
        console.log(typeof data);
        console.log(data);
        console.log(data.length);
        finalData = JSON.parse(data);
        finalData.push(req.body);
    });

    finalData = JSON.stringify(finalData);

    fs.writeFile(path.join(__dirname, "/db/db.json"), data, (err) => {
        if (err) throw err;
    });

    console.log("wrote to database.");
    console.log("new database content:");
    console.log(finalData);
});


app.listen(PORT, function () {
    console.log("Listening on PORT " + PORT);
});
