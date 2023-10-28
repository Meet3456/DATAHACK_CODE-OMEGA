import React from 'react'

const Card = (props) => {
  return (
    <div className='w-72 h-[400px] bg-gray-100 hover:bg-gray-200 rounded-lg pt-8'>
        <h2 className='font-bold text-2xl m-auto text-center'>{props.head}</h2>
        <p className='p-6 text-justify'>{props.info}</p>
    </div>
  )
}

export default Card