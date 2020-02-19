const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 8808;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });



  app.listen(PORT, function() {
    console.log("Listening on PORT " + PORT);
  });
  