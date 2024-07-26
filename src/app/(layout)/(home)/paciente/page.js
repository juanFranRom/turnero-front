'use client'
import React from 'react'

// Context
import { useUserContext } from '@/contexts/user'

// Components
import TableAux from './tableaux'
import Button from '@/components_UI/Button'
import ProtectedPath from '@/components/ProtectedPath'

const page = () => {
  const { user } = useUserContext()
  console.log(user);
  return (
    <ProtectedPath permisos={['ver_pacientes']}>
      <div className='u-1/1 u-flex-column-center-end u-p4'>
        <div className='u-1/1 u-flex-center-space-between u-m4--bottom'>
          <h1>Pacientes</h1>
          <Button className={'u-m2--bottom'} text={'Nuevo Paciente'} url={'/paciente/crear'}/>
        </div>
        <TableAux/>
      </div>
    </ProtectedPath>
  )
}

export default page