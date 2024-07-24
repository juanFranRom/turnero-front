'use client'
// Contexts
import { UserContextProvider } from '@/contexts/user'
import { FocusProvider } from '@/contexts/navegacion'
import { TurnoContextProvider } from "@/contexts/turno"
import { PacienteContextProvider } from '@/contexts/paciente'
import { ProfesionalContextProvider } from '@/contexts/profesional'
import { WebSocketProvider } from '@/contexts/webSocket';

// Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {

  return (
  <FocusProvider>
    <UserContextProvider>
      <TurnoContextProvider>
        <PacienteContextProvider>
          <ProfesionalContextProvider>
            <WebSocketProvider>
              <ToastContainer />
                {children}
            </WebSocketProvider>
          </ProfesionalContextProvider>
        </PacienteContextProvider>
      </TurnoContextProvider>
    </UserContextProvider>
  </FocusProvider>
  )
}
