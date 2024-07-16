'use client'
// react
import React from 'react'

// Context
import { useTurnoContext } from '@/contexts/turno'

// Components
import Turno from '@/components/Turno'
import Loader from '@/components_UI/Loader'
import ProtectedPath from '@/components/ProtectedPath'

const Home = ({}) => {
  const { fechaFormateada, loadingTurnos, turnos } = useTurnoContext()

  return (
    <ProtectedPath permisos={['ver_agenda']}>
      <div className='u-1/1 u-background--white'>
        <div className='u-bordered__bottom--thick u-p2'>
          <span className=' u-color--primary'>
            {fechaFormateada}
          </span>
        </div>
        {
          loadingTurnos?
            <div className='u-1/1 u-flex-center-center u-p5--vertical'>
              <Loader text='Cargando turnos...'/>
            </div>
          :
            <>
              {
                turnos && turnos.length > 0 &&
                turnos.map(( turno ) => {
                  return(
                    <Turno data={turno}/>
                  )
                })
              }
            </>
        }
      </div>
    </ProtectedPath>
  )
}

export default Home