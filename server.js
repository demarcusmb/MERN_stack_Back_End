require('dotenv').config()

// Pulls port from .env gives default vaule of 4000
// Pulls MONGODB_URL from .env
const { PORT = 4000, MONGODB_URL } = process.env

///////////////////////
// DEPENDICIES
///////////////////////
// imports express
const express = require('express');
// imports mongoose
const mongoose = require('mongoose');
// Create App Obj
const app = express();
//import middleware
const cors = require("cors");
const morgan = require("morgan")

///////////////////////
// DATABASE CONNECTION
///////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser:true,
})
// Connection Events
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

///////////////////////
// MIDDLEWARES
///////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////
// MODELS
///////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})

const People = mongoose.model("People", PeopleSchema);




///////////////////////
// ROUTES
///////////////////////
// Test Route
app.get("/", (req,res) => {
    res.send("Connected")
})

// People Index Route
app.get("/people", async (req, res) => {
    try{
        //send all people
        res.json(await People.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
})

// People Create Route
app.post("/people", async (req, res) => {
    try{
        //send all people
        res.json(await People.create(req.body));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
})

// People Delete Route
app.delete("/people/:id", async (req,res)=> {
    try{
        // send all people
        res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
})

// People Update Route
app.put("/people/:id", async (req, res) => {
    try {
      // send all people
      res.json(
        await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      // send error
      res.status(400).json(error);
    }
  });

///////////////////////
// LISTENER
///////////////////////

app.listen(PORT, () => console.log(`listening on Port ${PORT}`))