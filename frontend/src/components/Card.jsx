/* eslint-disable no-unused-vars */
import React from 'react'

function Card(type, description) {

    const cardColors = {
        Movement: 'bg-blue-500',
        Bonus: 'bg-green-500',
        Penalty: 'bg-red-500',
        Challenge: 'bg-yellow-500',
        Event: 'bg-purple-500',
      };
  
      
      return (
        <div
          className={`transform hover:scale-105 transition duration-300 flex flex-col items-center justify-center p-4 rounded-md shadow-md w-48 h-64 ${cardColors[type]} text-white`}
        >
          <h2 className="text-xl font-bold">{type}</h2>
          <p className="mt-2 text-sm">{description}</p>
        </div>
      );
}

export default Card

