'use client'
// react
import React from 'react'

// Context
import { useTurnoContext } from '@/contexts/turno'

// Components
import Turno from '@/components/Turno'
import Loader from '@/components_UI/Loader'

const Home = ({}) => {
  const { fechaFormateada, loadingTurnos, turnos } = useTurnoContext()

  return (
    <div className='u-1/1 u-background--white'>
      <div className='u-bordered__bottom--thick u-p2'>
        <span className=' u-color--primary'>
          {fechaFormateada}
        </span>
      </div>
      {
        loadingTurnos?
          <div className='u-1/1 u-flex-center-center'>
            <Loader text='Cargando turnos...'/>
          </div>
        :
          <>
            <Turno/>
            <Turno/>
          </>
      }
    </div>
  )
}

export default Home