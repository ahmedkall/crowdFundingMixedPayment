import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xDeC91017c484166e5E9Cd0b568EDc42c2EBbC6ba');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
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
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
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

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  return (
    <StateContext.Provider value={{ 
      address,
      connect,
      contract,
      publishCampaign,
      getCampaigns,
      getUserCampaigns }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);
