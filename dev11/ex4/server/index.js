const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const Vactions = require('./data/books.json');
app.use((req, res, next) => {
 res.set({
 'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
 'Access-Control-Allow-Methods': "GET, POST, PUT, DELETE",
 'Content-Type': 'application/json'
 });
 next();
});
app.listen(port);
console.log(`listening on port ${port}`);