const fs = require("fs");
const express = require("express");
const app = express();
const port = 3000;
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
const studentsJSON = require("./studentsApi.json");
const students = [...studentsJSON.names];
const empty = students[0];
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(port, () => {
    console.log("Server is running on port: " + port);
});
app.get("/", (req, res) => {
    res.render("home", { students, empty });
});
app.get("/students", (req, res) => {
    res.json(students);
});
app.get("/students/add", (req, res) => {
    res.render("add", { name: students[students.length - 1] });
});
app.get("/message/empty", (req, res) => {
    res.render("message", { message: "Name Input is empty" });
});
app.get("/message/exist", (req, res) => {
    res.render("message", { message: "Name already exist" });
});
app.get("/clearlist", (req, res) => {
    res.render("message", { message: "List Cleared" });
    const studentsJSON = { names: [] };
    const studentsString = JSON.stringify(studentsJSON);
    fs.writeFileSync("studentsAPI.json", studentsString);
});
app.post("/students", (req, res) => {
    const exist = students.some(
        (name) => name.toLowerCase() === req.body.name.toLowerCase()
    );
    if (exist) res.redirect("/message/exist");
    if (!req.body.name) res.redirect("message/empty");
    if (req.body.name && !exist) {
        students.push(req.body.name);
        res.redirect("/students/add");
    }
    const studentsJSON = { names: students };
    const studentsString = JSON.stringify(studentsJSON);
    fs.writeFileSync("studentsAPI.json", studentsString);
});
