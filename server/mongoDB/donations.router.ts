import express, { Request, Response } from "express";
import { ObjectId, WithId } from "mongodb";
import { collections } from "./services/database.service";
import Donation from './models/donations';

  



export const donationsRouter = express.Router();
donationsRouter.use(express.json());

donationsRouter.get("/:pId", async (req: Request, res: Response) => {
    try {
        const pId = req.params.pId;
        const donations = (await collections.donations?.find({ campaignId: pId }).toArray()) as unknown as Donation[];

        res.status(200).send(donations);
    } catch (error: unknown) {
  if (typeof error === "object" && error !== null && "message" in error) {
    res.status(400).send(error.message);
  } else {
    res.status(400).send("An error occurred");
  }
}

});


donationsRouter.post("/donateFiat", async (req: Request, res: Response) => {
    try {
        const newDonation = req.body as Donation;
        const result = await collections.donations?.insertOne(newDonation);

        const pipeline = [
          {
            '$addFields': {
              'amountDouble': {
                '$toDouble': '$amount'
              }
            }
          },
          {
            '$group': {
              '_id': '$campaignId', // Use '_id' with the field as the grouping criteria
              'totalAmount': {
                '$sum': '$amountDouble'
              }
            }
          },
          {
            '$project': { // Add this stage to rename '_id' back to 'campaignId'
              '_id': 0,
              'campaignId': '$_id',
              'totalAmount': 1
            }
          },
          {
            '$merge': {
              'into': 'campaigns_totals',
              'on': 'campaignId',
              'whenMatched': 'replace',
              'whenNotMatched': 'insert'
            }
          }
        ];
        
        
        const agg= await collections.donations?.aggregate(pipeline).toArray();
        console.log(agg)

        result
            ? res.status(201).send(`Successfully created a new donation with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new donation.");
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "message" in error) {
          res.status(400).send(error.message);
        } else {
          res.status(400).send("An error occurred");
        }
      }
      
});