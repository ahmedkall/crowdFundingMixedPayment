// External dependencies
import { ObjectId } from "mongodb";
// Class Implementation
export default class Donation {
    constructor(public donator: string, public campaignId: string, public amount: string,public paymentMethod: string,
        public paymentChargeId?: string, public id?: ObjectId) {}
}
