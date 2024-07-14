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
import NuevoTurno from "@/components/NuevoTurno"
import NuevoBloqueo from "@/components/NuevoBloqueo"
import NuevoPaciente from "@/components/NuevoPaciente"
import Overlay from "@/components_UI/Overlay"
import PopUp from '@/components_UI/PopUp'


export default function RootLayout({ children }) {
  const { openTurno, openBloqueo } = useTurnoContext()
  const { openPaciente } = usePacienteContext()

  return (
    <>
      <Header/>
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
      <SidebarCalendar/>
      <Page>
        {children}
      </Page>
    </>
  )
}
