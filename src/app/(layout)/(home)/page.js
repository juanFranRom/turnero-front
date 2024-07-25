// React
import React from 'react'

// Components
import Calendario from '@/components/Calendario'
import ProtectedPath from '@/components/ProtectedPath'


const page = () => {
  return (
    <ProtectedPath permisos={['ver_turnos']}>
      <Calendario/>
    </ProtectedPath>
  )
}

export default page