import express from "express";
import { connectToDatabase } from "./mongoDB/services/database.service";
import { donationsRouter } from "./mongoDB/donations.router";
import { campaignsRouter } from "./mongoDB/campaigns.router";

const app = express(); // Define app
const port = process.env.PORT || 3000; // Define port

connectToDatabase()
    .then(() => {
        app.use(express.json()); // Add this line to use JSON middleware
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
          });
          app.use("/campaigns", campaignsRouter);
        app.use("/donations", donationsRouter);
        

        app.listen(port, () => { 
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });


