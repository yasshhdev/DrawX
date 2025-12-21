import express from "express";
import { userrouter } from "./Router/user";
import dotenv from "dotenv"

dotenv.config();

const app = express ();

app.use("/user",userrouter)


app.listen(3002)