import React from 'react'

// Components
import NuevoPaciente from '@/components/NuevoPaciente'
import Button from '@/components_UI/Button'
import ProtectedPath from '@/components/ProtectedPath'

const page = ({ params }) => {
  return (
      <div className='u-1/1 u-flex-center-center u-p2--vertical u-p5--horizontal'>
        {
          params && params.id?
          <ProtectedPath permisos={['modificar_pacientes']}/>
          :
          <ProtectedPath permisos={['crear_pacientes']}/>

        }
        <div className='u-absolute--top_right u-zindex--higher'>
          <Button text={'Volver'} url={'/paciente'}/>
        </div>
        <NuevoPaciente id={ params && params.id ? params.id[0] : null }/>
      </div>
  )
}

export default page