import React, { useContext, createContext, ReactNode } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { BaseContract, ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema, SmartContract } from '@thirdweb-dev/sdk';

interface StateContextValue {
  address: string | undefined;
  connect: () => any;
  contract: SmartContract<BaseContract>| undefined;
  publishCampaign: any;
  getCampaigns: () => any;
  getUserCampaigns: () => any;
  donate: (pId: number, amount: string) => any;
  getDonations: (pId: number) => any;
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
  const donate = async (pId: number, amount: string) => {
    const data = await contract?.call('donateCampaign', pId, { value: ethers.utils.parseEther(amount)});
    return data;
  }

  const getDonations = async (pId: number) => {
    const donations = await contract?.call('getDonators', pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  const value: StateContextValue = {
    address,
    connect,
    contract,
    publishCampaign,
    getCampaigns,
    getUserCampaigns,
    donate,
    getDonations
  };

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
  
}


export const useStateContext = () => useContext(StateContext);
