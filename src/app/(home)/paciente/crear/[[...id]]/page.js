import React from 'react'

// Components
import NuevoPaciente from '@/components/NuevoPaciente'
import Button from '@/components_UI/Button'

const page = ({ params }) => {
  return (
    <div className='u-1/1 u-flex-center-center u-p2--vertical u-p5--horizontal'>
      <div className='u-absolute--top_right u-zindex--higher'>
        <Button text={'Volver'} url={'/paciente'}/>
      </div>
      <NuevoPaciente id={ params && params.id ? params.id[0] : null }/>
    </div>
  )
}

export default page