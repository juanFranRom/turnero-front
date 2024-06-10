import React from 'react'

// Components
import TableAux from './tableaux'
import Button from '@/components_UI/Button'

const page = () => {
  return (
    <div className='u-1/1 u-flex-column-center-end u-p4'>
      <Button className={'u-m2--bottom'} text={'Nuevo Paciente'} url={'/paciente/crear'}/>
      <TableAux/>
    </div>
  )
}

export default page