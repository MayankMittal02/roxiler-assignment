require( "dotenv" ).config();
const express = require('express');
// const fetch = require('node-fetch');
const path = require("path");

const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors')
const errorHandlerMiddleware = require('./middleware/error-handler')
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
const PORT = process.env.PORT | 5000;

const products = require('./routes/products')
const graphs = require('./routes/graphs')
const initializeDatabase = require('./routes/initialise-db')

app.use('/getproducts',products)
app.use('/getgraphs' , graphs)
app.use('/initialize-database' , initializeDatabase)
app.use(errorHandlerMiddleware)


app.use(express.static(path.join(__dirname, "./build")));

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});


mongoose.connect(process.env.CONNECTION_URI).then(() => {
    console.log('App connected to database');
    app.listen(PORT, function () {
        console.log(`app listening on port ${PORT}!`);
    });
})
    .catch((error) => {
        console.log(error);
    });