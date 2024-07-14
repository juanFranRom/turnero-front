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
import NuevoPaciente from "@/components/NuevoPaciente"
import Overlay from "@/components_UI/Overlay"
import PopUp from '@/components_UI/PopUp'


export default function RootLayout({ children }) {
  const { openTurno } = useTurnoContext()
  const { openPaciente } = usePacienteContext()

  return (
    <ProtectedPath>
      <Header/>
      { openTurno && <NuevoTurno/> }
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
    </ProtectedPath>
  )
}
