import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { Counter, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb, ethereum, coinabaseCommerce } from '../assets';

interface Donation {
  donator: string;
  donation: string;
}

const CampaignDetails = () => {
  const { state } = useLocation();
  console.log(state)
  const navigate = useNavigate();
  const contextValue = useStateContext();
  if (!contextValue) throw new Error('StateContextValue is not available');
  const { donateCrypto,donateFiat, getDonations, contract, address } = contextValue;

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([] as Donation[]);
  const [paymentType, setPaymentType] = useState('crypto')

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);
  }

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address])

  const handleDonate = async () => {
    setIsLoading(true);
    if(paymentType==='crypto')
    await donateCrypto(state.pId, amount);
    else
    await donateFiat(state.pId, amount)
    navigate('/')
    setIsLoading(false);
  }

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%' }}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <Counter title="Days Left" value={remainingDays} />
          <Counter title={`Raised of ${state.target}`} value={state.amountCollected} />
          <Counter title="Total Backers" value={donators.length.toString()} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Donators</h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? donators.map((item, index) => (
                <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                  <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donation}</p>
                </div>
              )) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>

            <div className="mt-[30px] grid grid-cols-2 gap-4">
              <div
                className={`flex items-center p-3 rounded-lg cursor-pointer ${paymentType === 'crypto' ? 'bg-gray-100' : ''
                  }`}
                onClick={() => setPaymentType('crypto')}
              >
                <img src={ethereum} alt="Crypto" className="w-10 h-10 mr-3" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium">Pay with Crypto</h3>
                  <p className="text-gray-500">Ethereum</p>
                </div>
              </div>

              <div
                className={`flex items-center p-3 rounded-lg cursor-pointer ${paymentType === 'fiat' ? 'bg-gray-100' : ''
                  }`}
                onClick={() => setPaymentType('fiat')}
              >
                <img src={coinabaseCommerce} alt="Fiat" className="w-10 h-10 mr-3" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium">Pay with Fiat</h3>
                  <p className="text-gray-500">USD, EUR, GBP, and more</p>
                </div>
              </div>
            </div>

            <div className="mt-[30px]">
              {paymentType === 'crypto' ? (
                <input
                  type="number"
                  placeholder="ETH 0.1"
                  step="0.01"
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              ) : (
                <input
                  type="number"
                  placeholder="USD 10"
                  step="0.01"
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              )}

              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#feda6a] mt-5"
                handleClick={handleDonate}
              />
            </div>
          </div>


        </div>
      </div>
    </div >
  )
}

export default CampaignDetails