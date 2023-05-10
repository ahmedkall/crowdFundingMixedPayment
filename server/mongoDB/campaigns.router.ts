import express, { Request, Response } from "express";
import { collections } from "./services/database.service";
import Campaign from "./models/campaigns";
import { ObjectId } from 'mongodb';

export const campaignsRouter = express.Router();
campaignsRouter.use(express.json());
console.log('campaignsRouter')
campaignsRouter.get("/:pId", async (req: Request, res: Response) => {
  try {
   
    const pId = req.params.pId;
    const filter = {
      'campaignId': pId
    };
    console.log('filter')
    console.log(filter)
    const campaigns = (await collections.campaigns?.find(filter).toArray()) as unknown as Campaign[];
    
    res.status(200).send(campaigns[0]);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "message" in error) {
      res.status(400).send(error.message);
    } else {
      res.status(400).send("An error occurred");
    }
  }

});