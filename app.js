//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});


const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name: "Welcome to your todolist!"
}); 

const item2 = new Item ({
    name: "Hit + to add a new item."
});

const item3 = new Item ({
    name: "<-- use this to delete an item.>"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", (req,res) => {

    Item.find({}).then((foundItems)=> {

        if (foundItems.length === 0){

            Item.insertMany(defaultItems).then(function(){
                console.log("Data inserted");  // Success
            }).catch(function(error){
                console.log(error);      // Failure
            });

            res.redirect("/");
            
        }else{
            res.render('list', {listTitle: "Today", newListItems: foundItems });
        }
        


    }).catch((err) => {
        console.log(err);
    });


});

app.get("/:customListName", (req,res) => {
    const customListName = req.params.customListName;

    List.findOne({
        name: customListName
    }).then((foundList) => {
        if (foundList) {
            //show existed list
            res.render("list",  {listTitle: foundList.name, newListItems: foundList.items } );
        } else {
            //create a new list
            console.log("doesnt exist");

            const list = new List({
                name: customListName,
                items: defaultItems
            });

            list.save();

            res.redirect("/" + customListName);
        }
    }).catch((err) => {
        console.log(err);
    });




});

app.post("/", (req,res) => {

  const itemName = req.body.newTask;
  const listName = req.body.list;

    const item = new Item({
        name: itemName
    });


    if(listName === "Today") {
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}).then((foundList) => {
            foundList.items.push(item);
            foundList.save();

            res.redirect("/" + listName);
        }).catch((err) => {
            console.log(err);
        });
    }

        
});

app.post("/delete", (req,res) => {

    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId).then(() => {
            console.log("Succesfully deleted");
        }).catch((err) => {
            console.log(err);
        });
    
        res.redirect("/");
    } else {
        List.findByIdAndUpdate({name: listName}, {$pull: {items: {_id:checkedItemId}}}).then((foundList)=> {
            res.redirect("/" + listName);
        }).catch((err)=>{
            console.log(err);
        });
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