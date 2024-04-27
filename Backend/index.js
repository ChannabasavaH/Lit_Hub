import dotenv from 'dotenv'
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import admin from 'firebase-admin'
import serviceAccount from './firebaseConfig.json' with { type: "json" };
import ExpressError from "./utils/ExpressError.js";
import booksRouter from "./routes/booksRouter.js";
import reviewRouter from './routes/reviewRouter.js'
import userRouter from './routes/usersRouter.js'

const dbURL = process.env.ATLASDB_URL;

const app = express();

app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://litrary-hub-default-rtdb.asia-southeast1.firebasedatabase.app/'
});

app.use("/api/books",booksRouter);
app.use("/api/books",reviewRouter);
app.use("/api",userRouter);

app.use("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).send(message);
});


mongoose.connect(dbURL)
  .then(() => {
    console.log("connected to database");
    app.listen(8080, () => {
      console.log("app is listening on port 8080");
    });
  })
  .catch((error) => {
    console.log(error);
  })