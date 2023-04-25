import React from 'react';

interface CounterProps {
  title: string;
  value: string;
}

const Counter: React.FC<CounterProps> = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center w-[150px]">
      <h4 className="font-epilogue font-bold text-[30px] text-white p-3 bg-[#1c1c24] rounded-t-[10px] w-full text-center truncate">{value}</h4>
      <p className="font-epilogue font-normal text-[16px] text-[#808191] bg-[#feda6a] px-3 py-2 w-full rouned-b-[10px] text-center">{title}</p>
    </div>
  );
};

export default Counter;
