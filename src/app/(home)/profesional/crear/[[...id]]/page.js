import React from 'react'

// Components
import NuevoProfesional from '@/components/NuevoProfesional'

const page = ({ params }) => {
  return (
    <div className='u-1/1 u-flex-center-center u-p2--vertical u-p5--horizontal'>
      <NuevoProfesional  id={ params.id[0] ?? null }/>
    </div>
  )
}

export default page