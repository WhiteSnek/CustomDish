import React from 'react'
import Loading from '../assets/loading.gif'

const Loader = () => {
  return (
    <div className='flex justify-center items-center'>
      <img src={Loading} alt='Loading' className='w-12' />
    </div>
  )
}

export default Loader
