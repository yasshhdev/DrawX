import "dotenv/config"
import express from "express";
import { userrouter } from "./Router/user";


const app = express ();

app.use("/user",userrouter)


app.listen(3002)