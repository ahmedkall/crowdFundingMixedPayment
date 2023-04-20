import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const contextValue = useStateContext();
  if (!contextValue) throw new Error('StateContextValue is not available');
  const { getUserCampaigns, address, contract } = contextValue;
  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (contract) fetchCampaigns();
    console.log(contract)
  }, [address, contract]);
  return (
    <>
      <div className='flex justify-center'>
        <div className="rounded-3xl shadow-xl max-w-xs my-20 bg-[#feda6a] ">
          <div className="flex justify-center -mt-8">
            <img src="https://i.imgur.com/8Km9tLL.jpg" className="rounded-full border-solid border-white border-2 -mt-3" />
          </div>
          <div className="text-center px-3 pb-6 pt-2">
            <h3 className="text-white text-sm bold font-sans">Olivia Dunham</h3>
            <p className="mt-2 font-sans font-light text-white">Hello, i'm from another the other side!</p>
          </div>
        </div>
      </div><DisplayCampaigns title="My Campaigns" isLoading={isLoading} campaigns={campaigns} centered={true} /></>

  )
}

export default Profile