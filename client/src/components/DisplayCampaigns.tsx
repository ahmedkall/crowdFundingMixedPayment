import React from 'react';
import { useNavigate } from 'react-router-dom';

import FundCard from './FundCard';
import { loader } from '../assets';

interface DisplayCampaignsProps {
  title: string;
  isLoading: boolean;
  campaigns: any[];
  centered?: boolean;
}

const DisplayCampaigns: React.FC<DisplayCampaignsProps> = ({ title, isLoading, campaigns, centered }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign: { title: any; }) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };


  return (
    <div className={`flex flex-col ${centered ? 'items-center' : ''}`}>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({campaigns.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campaigns yet
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard key={campaign.id} {...campaign} handleClick={() => handleNavigate(campaign)} />
          ))}
      </div>
    </div>


  );
};

export default DisplayCampaigns;
