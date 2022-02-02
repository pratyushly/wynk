import React from 'react';

const Delete = (props) => {
  return <button className="w-max px-4 py-2 text-sm rounded-[3px] hover:bg-[#eb57571a] border-2 border-[#eb575780] transition focus:outline-none focus:bg-[#eb57571a] select-none text-[#eb5757]" onClick={() => props.onClick()}>{props.deleteMessage}</button>;
};

export default Delete;
