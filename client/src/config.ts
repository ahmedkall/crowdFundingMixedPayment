// config.ts
import dotenv from "dotenv";

dotenv.config({path:'C:/Users/gtvah/Desktop/crowdFunding/crowdFundingMixedPayment/client/.env' });

export const config = {
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  DB_CONN_STRING: process.env.DB_CONN_STRING,
  DB_NAME: process.env.DB_NAME,
  DONATIONS_COLLECTION_NAME: process.env.DONATIONS_COLLECTION_NAME,
};
