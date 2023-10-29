import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Card = (props) => {
  return (
    <div className='max-w-xs   h-[400px] bg-gray-300 hover:bg-gray-400 shadow-lg rounded-lg pt-8 hover:transform hover:scale-105 transition-transform duration-300'>
      <h2 className='font-bold text-2xl  mb-10px text-center'>{props.head}</h2>
      <FontAwesomeIcon
        icon={props.icon}
        style={{ fontSize: "40px", marginTop: "30px" }}
      ></FontAwesomeIcon>
      <p className='p-6 text-justify'>{props.info}</p>
    </div>
  );
};

export default Card;
