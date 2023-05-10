import React, { useContext, createContext, ReactNode } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { BaseContract, ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema, SmartContract } from '@thirdweb-dev/sdk';
import Stripe from 'stripe';
import axios from 'axios';



const stripe = new Stripe('', {
  apiVersion: '2022-11-15',
});


const getEthPrice = async (): Promise<number> => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
  return response.data.ethereum.usd;
};

const ethPrice = await getEthPrice();

interface Donation {
  donator: string;
  campaignId: string;
  amount: string;
  paymentMethod: string;
  paymentChargeId?: string;
  id?: string; // Use string instead of ObjectId for simplicity in the frontend
}




interface StateContextValue {
  address: string | undefined;
  connect: () => any;
  contract: SmartContract<BaseContract> | undefined;
  publishCampaign: any;
  getCampaigns: () => any;
  getUserCampaigns: () => any;
  donateCrypto: (pId: number, amount: string) => any;
  getDonations: (pId: number) => any;
  donateFiat: (pId: number, amount: string) => any;
  
}

const StateContext = createContext<StateContextValue | null>(null);
interface StateContextProviderProps {
  children: ReactNode;
}

export const StateContextProvider = ({ children }: StateContextProviderProps) => {
  const { contract } = useContract('0xDeC91017c484166e5E9Cd0b568EDc42c2EBbC6ba');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form: { title: string; description: string; image: string; target: string; deadline: string | number | Date; }) => {
    try {
      const data = await createCampaign([
        address, // owner
        form.title, // title
        form.description, // description
        form.image,
        form.target,
        new Date(form.deadline).getTime(), // deadline,
      ])
      console.log("contract call success", data)
    } catch (error) {
      console.log(error)
    }
  }
  const getCampaigns = async () => {
    const campaigns = await contract?.call('getCampaigns');
    let amountCollectedInFiat= await getAmountCollectedInFiatPerCampaign(1)

    const parsedCampaings = campaigns.map((campaign: { owner: any; title: any; description: any; target: { toString: () => ethers.BigNumberish; }; deadline: { toNumber: () => any; }; amountCollected: { toString: () => ethers.BigNumberish; }; image: any; }, i: any) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign: { owner: string; }) => campaign.owner === address);

    return filteredCampaigns;
  }


  const donateCrypto = async (pId: number, amount: string) => {
    const data = await contract?.call('donateCampaign', pId, { value: ethers.utils.parseEther(amount) });
    return data;
  }

  async function fetchDonations(pId: string): Promise<Donation> {
    const response = await fetch(`/donations/${pId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch donations: \${response.statusText}`);
    }

    const donations = await response.json();
    return donations;
  }

  async function postDonation(donation: Donation): Promise<string> {
    const response = await fetch('http://localhost:3000/donations/donateFiat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donation),
    });

    if (!response.ok) {
      throw new Error(`Failed to create a new donation: \${response.statusText}`);
    }

    const resultText = await response.text();
    return resultText;
  }



  const donateFiat = async (pId: number, amount: string) => {


    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Number(amount),
    //   currency: 'usd',
    // });
    if(!address) connect()

    const newFiatDonation = 
    {
      "donator": address ? address : '',
      "campaignId": pId.toString(),
      "amount": amount,
      "paymentMethod": "Stripe",
      //"paymentIntentId": paymentIntent.id,
      "paymentIntentId": '1'
    }

    const result = await postDonation(newFiatDonation)


  }

  const getDonations = async (pId: number) => {
    /** Get Ethereum Donations */
    const donations = await contract?.call('getDonators', pId);
    var numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    /** Get Fiat Donations */

    await fetch(`http://localhost:3000/donations/${pId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((fiatDonations) => {
        if (fiatDonations) {
          for (let donation of fiatDonations) {
            parsedDonations.push({
              donator: donation.donator,
              donation: (Number(donation.amount) / ethPrice).toFixed(3)
            })
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching donations:", error.message);
        console.error(error);
      });
    return parsedDonations;
  }

  const getAmountCollectedInFiatPerCampaign = async (pId: number) => {
    

    await fetch(`http://localhost:3000/campaigns/${pId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((campaign) => {
        console.log(campaign)
        if (campaign) return (campaign.totalAmount/ethPrice).toFixed(3);
      })
      .catch((error) => {
        console.error("Error fetching donations:", error.message);
        console.error(error);
      });
      return 0;
  }


  const value: StateContextValue = {
    address,
    connect,
    contract,
    publishCampaign,
    getCampaigns,
    getUserCampaigns,
    donateCrypto,
    getDonations,
    donateFiat,
  };

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;

}


export const useStateContext = () => useContext(StateContext);
