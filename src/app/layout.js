// Contexts
import { UserContextProvider } from '@/contexts/user'
import { FocusProvider } from '@/contexts/navegacion'
import { TurnoContextProvider } from "@/contexts/turno"
import { PacienteContextProvider } from '@/contexts/paciente'
import { ProfesionalContextProvider } from '@/contexts/profesional'

// Fonts
import { Open_Sans } from 'next/font/google'

// SASS
import './styles.scss'

export const metadata = {
  title: "Turnero Innova",
  description: "Turnero Innova",
}
const openSans = Open_Sans({ weight: ['400'], subsets: ['cyrillic']})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description}/>
        <link rel="icon" href={metadata.icon}/>
      </head>
      <body className={openSans.className}>
        <FocusProvider>
          <UserContextProvider>
            <TurnoContextProvider>
              <PacienteContextProvider>
                <ProfesionalContextProvider>
                  {children}
                </ProfesionalContextProvider>
              </PacienteContextProvider>
            </TurnoContextProvider>
          </UserContextProvider>
        </FocusProvider>
      </body>
    </html>
  )
}
