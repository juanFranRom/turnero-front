import React from 'react'

// Components
import NuevoPaciente from '@/components/NuevoPaciente'

const page = ({ params }) => {
  return (
    <div className='u-1/1 u-flex-center-center u-p2--vertical u-p5--horizontal'>
      <NuevoPaciente id={ params && params.id ? params.id[0] : null }/>
    </div>
  )
}

export default page