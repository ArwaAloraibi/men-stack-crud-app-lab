// Import modules
const dotenv= require('dotenv'); // require package

dotenv.config(); // Loads the environment variables from .env file

const express = require('express');
const methodOverride = require("method-override");
const morgan = require('morgan');
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const PORT=3000;

// DB connection
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    // console to check if it is working or not
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


// Import the Cat model: you can get rid of .js when you require 
//  to interact with the cat object 
const Cat = require("./models/cats.js");


// Middleware

app.use(methodOverride("_method")); //overRide before dev morgan
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
 app.use(express.static(path.join(__dirname, "public")));



// Routes

// GET /cats
app.get("/cats", async (req, res) => {
  const msg= req.query.msg;
  const cats = await Cat.find();
  console.log(msg);
  res.render('cats/index.ejs', {cats, msg}); // send the cats to be displayed 
});


app.get("/cats/new", (req, res) => {
  res.render('cats/new.ejs');
  //then make a folder with the same name of the model
});


app.get("/cats/:catId", async (req, res) => {
  const catId= req.params.catId;
  const cat = await Cat.findById(catId);
  res.render('cats/show.ejs', {cat});
});


// POST /cats
app.post("/cats", async (req, res) => {

      if (req.body.isReadyToAdopt === "on") {
    // access the body in the new.ejs 
    req.body.isReadyToAdopt = true;}
    else{
            req.body.isReadyToAdopt = false;
    }
    console.log("BODY on create:", req.body); //debug

      await Cat.create(req.body);
      res.redirect("/cats"); // redirect to index fruits to see the result
});


app.get("/", async (req, res) => {
  res.render('index.ejs');
});

// Delete route
app.delete("/cats/:catId", async (req, res) => {
    const catId= req.params.catId;
    await Cat.findByIdAndDelete(catId);
  res.redirect('/cats?msg="record deleted"');

});



app.get("/cats/:catId/edit", async (req, res) => {
  const foundCat = await Cat.findById(req.params.catId);
  res.render("cats/edit.ejs", {cat: foundCat, });
});

// ----------------------------------------------------
// Update the cat 
app.put("/cats/:catId", async (req, res) => {
  // Handle the 'isReadyToAdopt' checkbox data
  if (req.body.isReadyToAdopt === "on") {
    req.body.isReadyToAdopt = true;
  } else {
    req.body.isReadyToAdopt = false;
  }
  
  // Update the cat info in the database
  await Cat.findByIdAndUpdate(req.params.catId, req.body);

  // Redirect to the cat's show page to see the updates
  res.redirect(`/cats/${req.params.catId}`);
});

// ----------------------------------------------------

app.listen(PORT, () => {
  console.log('Listening on port 3000');
});
