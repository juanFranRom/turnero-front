'use client'

// Contexts
import { useTurnoContext } from '@/contexts/turno'
import { usePacienteContext } from "@/contexts/paciente"

// Icons
import { IoMdClose } from "react-icons/io"

// Components
import Header from "@/components/Header"
import SidebarCalendar from "@/components/SidebarCalendar"
import Page from "@/components/Page"
import ProtectedPath from "@/components/ProtectedPath"
import NuevoTurno from "@/components/NuevoTurno"
import NuevoBloqueo from "@/components/NuevoBloqueo"
import NuevoPaciente from "@/components/NuevoPaciente"
import Overlay from "@/components_UI/Overlay"
import PopUp from '@/components_UI/PopUp'
import Button from '@/components_UI/Button'
import Loader from '@/components_UI/Loader'


export default function RootLayout({ children }) {
  const { openTurno, openBloqueo, reprogramando, setReprogramando, cancelandoBloqueo, setCancelandoBloqueo, cancelarBloqueo, filtros } = useTurnoContext()
  const { openPaciente } = usePacienteContext()

  return (
    <ProtectedPath>
      <Header blocked={ reprogramando ? true : false }/>
      { openTurno && <NuevoTurno/> }
      { openBloqueo && <NuevoBloqueo/> }
      { 
        openPaciente && 
        <Overlay>
          <PopUp centered={true}>
            <NuevoPaciente width={'600px'} height={'80vh'} toClose={true}/>
          </PopUp>
        </Overlay> 
      }
      {
          cancelandoBloqueo &&
          <Overlay>
              <PopUp centered={true}>
                  <div className='u-1/1 u-flex-column-start-center u-p3--vertical'>
                    {
                      typeof cancelandoBloqueo === 'boolean' && cancelandoBloqueo ?
                        <div className='u-1/1 u-p5'><Loader text='Cancelando...'/></div>
                      :
                        <>
                          <p className='u-text--1 u-m2--bottom'>¿Seguro desea cancelar el bloqueo?</p>
                          <div className='u-1/1 u-flex-column-center-center u-text_align--start u-p4--vertical'>
                            <p className='u-1/1'>Profesional: {filtros.profesional.apellido}, {filtros.profesional.nombre}</p>
                            <p className='u-1/1'>Desde: {new Date(cancelandoBloqueo.start).getDate()}/{new Date(cancelandoBloqueo.start).getMonth() + 1}/{new Date(cancelandoBloqueo.start).getFullYear()} {new Date(cancelandoBloqueo.start).getHours().toString().padStart(2, '0')}:{new Date(cancelandoBloqueo.start).getMinutes().toString().padStart(2, '0')}</p>
                            <p className='u-1/1'>Hasta: {new Date(cancelandoBloqueo.end).getDate()}/{new Date(cancelandoBloqueo.end).getMonth() + 1}/{new Date(cancelandoBloqueo.end).getFullYear()} {new Date(cancelandoBloqueo.end).getHours().toString().padStart(2, '0')}:{new Date(cancelandoBloqueo.end).getMinutes().toString().padStart(2, '0')}</p>
                          </div>
                          <div className='u-1/1 u-flex-end-center'>
                              <Button 
                                  text={'Aceptar'} 
                                  clickHandler={
                                      () => {
                                          cancelarBloqueo(cancelandoBloqueo.id)
                                      }
                                  }
                              />
                              <Button text={'Cancelar'} clickHandler={() => setCancelandoBloqueo(null)}/>
                          </div>
                        </>
                    }
                  </div>
              </PopUp>
          </Overlay>
      }
      <SidebarCalendar blocked={ reprogramando ? true : false }/>
      <Page>
        {children}
      </Page>
    </ProtectedPath>
  )
}
