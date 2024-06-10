import React from 'react'

// Components
import TableAux from './tableaux'
import Button from '@/components_UI/Button'

const page = () => {
  return (
    <div className='u-1/1 u-flex-column-center-end u-p4'>
      <div className='u-1/1 u-flex-center-space-between u-m4--bottom'>
        <h1>Pacientes</h1>
        <Button className={'u-m2--bottom'} text={'Nuevo Paciente'} url={'/paciente/crear'}/>
      </div>
      <TableAux/>
    </div>
  )
}

export default page