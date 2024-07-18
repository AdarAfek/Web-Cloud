require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
const db = require("./db");
const dbconnect = db.createConnection;
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Content-Type": "application/json",
  });
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//User routes
const { userRouter } = require("./routers/usersRouter");
app.use("/api/user",userRouter);










app.listen(port);
console.log(`listening on port ${port}`);
