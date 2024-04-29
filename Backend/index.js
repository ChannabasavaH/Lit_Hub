import dotenv from 'dotenv'
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import admin from 'firebase-admin'
import ExpressError from "./utils/ExpressError.js";
import path from 'path';
import { fileURLToPath } from 'url'; 
import booksRouter from "./routes/booksRouter.js";
import reviewRouter from './routes/reviewRouter.js'
import userRouter from './routes/usersRouter.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const dbURL = process.env.ATLASDB_URL;

const app = express();

app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.PRIVATE_TYPE,
    projectId: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
    client_x509_cert_url: process.env.CLIENT_X,
    universe_domain: process.env.UNIVERSE_DOMAIN,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.DATABASE_URL
});

app.use(express.static(path.join(__dirname, 'dist')));

app.use("/api/books",booksRouter);
app.use("/api/books",reviewRouter);
app.use("/api",userRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,  'dist' , 'index.html'));
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