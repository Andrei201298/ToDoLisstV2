//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

let items = [];
let workItems = [];

app.get("/", (req,res) => {
    let today = new Date();
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };


    let day = today.toLocaleDateString("en-US", options);

    res.render('list', {listTitle: day, newListItems: items });
});

app.post("/", (req,res) => {

    let newItem = req.body.newTask;

    if (req.body.list == "Work") {
        workItems.push(newItem);
        res.redirect("/work");
    } else {
        items.push(newItem);
        res.redirect("/");
    }
        
});

app.get("/work", (req,res) => {
    res.render("list", {listTitle:"Work List", newListItems: workItems});
});

app.get("/about", (req,res) => {
    res.render("about");
});

app.post("/work", (req,res) => {
    let newWorkItem = req.body.newTask;

     workItems.push(newWorkItem);

     res.redirect("/work");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});