// import { MongoClient, Db } from 'mongodb';

// const url = 'mongodb://localhost:27017';
// const dbName = 'crowdfunding';

// async function connectDB(): Promise<Db> {
//   const client = new MongoClient(url);
//   await client.connect();
//   const db = client.db(dbName);
//   return db;
// }

// export default connectDB;

// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";


// Global Variables
export const collections: { donations?: mongoDB.Collection , campaigns?: mongoDB.Collection} = {}

// Initialize Connection
export async function connectToDatabase () {

dotenv.config();

const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);
        
await client.connect();
    
const db: mongoDB.Db = client.db(process.env.DB_NAME);

const donationsCollection: mongoDB.Collection = db.collection(process.env.DONATIONS_COLLECTION_NAME!);
const campaignsCollection: mongoDB.Collection= db.collection(process.env.CAMPAIGNS_TOTAL_COLLECTION_NAME!);

collections.donations = donationsCollection;
collections.campaigns=campaignsCollection;
   
     console.log(`Successfully connected to database: ${db.databaseName} and collection: ${donationsCollection.collectionName} and collection: ${campaignsCollection.collectionName}`);
}

