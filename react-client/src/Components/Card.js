import React from 'react'

const Card = (props) => {
  return (
    <div className='w-72 h-[450px] bg-gray-100 hover:bg-gray-200 rounded-lg'>
        <h2 className='font-bold text-2xl ml-[60px]'>{props.head}</h2>
        <p className='p-6'>{props.info}</p>
    </div>
  )
}

export default Card