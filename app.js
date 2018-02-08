const express = require('express');
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//connect to mongodb with mongoose; mongoose use model and schema 

mongoose.connect(
    'mongodb://testuser:' +
    process.env.MONGO_ATLAS_PW + 
    '@clustertester-shard-00-00-obaic.mongodb.net:27017,clustertester-shard-00-01-obaic.mongodb.net:27017,clustertester-shard-00-02-obaic.mongodb.net:27017/test?ssl=true&replicaSet=ClusterTester-shard-0&authSource=admin', 
    {
        useMongoClient: true
    }
)
// mongoose.Promise = global.Promise;

// Morgan supports a handful of pre-defined logged formats with well-know names/structures. combined, common, dev, short, tiny. That string is telling morgan which log format you'd like it to use
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// code order matter here 
// use: is a middleware, middleware give some respond
// app.get('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'It works! this is root https page'
//     });
// });
app.use('/products', productRoutes); //middleware here filer out only products
app.use('/orders', orderRoutes); //middleware here filer out only orders

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});




module.exports = app;