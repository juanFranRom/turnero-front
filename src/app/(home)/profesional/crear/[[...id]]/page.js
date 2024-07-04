import React from 'react'

// Components
import NuevoProfesional from '@/components/NuevoProfesional'
import Button from '@/components_UI/Button'

const page = ({ params }) => {
  return (
    <div className='u-1/1 u-flex-center-center u-p2--vertical u-p5--horizontal'>
      <div className='u-fixed--top_right u-zindex--higher'>
        <Button text={'Volver'} url={'/profesional'}/>
      </div>
      <NuevoProfesional id={ params && params.id ? params.id[0] : null }/>
    </div>
  )
}

export default page