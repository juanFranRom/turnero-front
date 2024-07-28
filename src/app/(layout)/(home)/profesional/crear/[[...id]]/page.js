import React from 'react'

// Components
import NuevoProfesional from '@/components/NuevoProfesional'
import Button from '@/components_UI/Button'
import ProtectedPath from '@/components/ProtectedPath'

const page = ({ params }) => {
  return (
      <div className='u-1/1 u-flex-center-center u-p2--vertical u-p5--horizontal u-p1--horizontal@mobile'>
        {
          params && params.id?
          <ProtectedPath permisos={['modificar_profesionales']}/>
          :
          <ProtectedPath permisos={['crear_profesionales']}/>

        }
        <div className='u-absolute--top_right u-zindex--higher'>
          <Button text={'Volver'} url={'/profesional'}/>
        </div>
        <NuevoProfesional id={ params && params.id ? params.id[0] : null }/>
      </div>
  )
}

export default page