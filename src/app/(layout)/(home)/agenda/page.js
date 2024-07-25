'use client'
// react
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import { FiPrinter } from "react-icons/fi";
// Context
import { useTurnoContext } from '@/contexts/turno'

// Components
import Turno from '@/components/Turno'
import Loader from '@/components_UI/Loader'
import ProtectedPath from '@/components/ProtectedPath'

const Agenda = ({}) => {
  const { fechaFormateada, loadingTurnos, turnos } = useTurnoContext()
  const printRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  })

  return (
    <ProtectedPath permisos={['ver_agenda']}>
      <div className='u-1/1 u-background--white'>
        <div className='u-bordered__bottom--thick u-p2 u-1/1 u-flex-center-space-between'>
          <span className=' u-color--primary'>
            {fechaFormateada}
          </span>
          <FiPrinter  className='c-fixed-print-button' size={50} onClick={handlePrint} />
        </div>
        {
          loadingTurnos?
            <div className='u-1/1 u-flex-center-center u-p5--vertical'>
              <Loader text='Cargando turnos...'/>
            </div>
          :
            <>
              <div ref={printRef}>
                {
                  turnos && turnos.length > 0 &&
                  turnos.map((turno) => {
                    return (
                      <Turno data={turno} key={turno.id} />
                    )
                  })
                }
              </div>
            </>
        }
      </div>
    </ProtectedPath>
  )
}

export default Agenda
