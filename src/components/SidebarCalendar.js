'use client'
// React
import { useState } from 'react'

// Components
import Calendar from '@/components_UI/Calendar'

// Contexts
import { useTurnoContext } from '@/contexts/turno'

const SidebarCalendar = ({  }) => {
  const { openCalendar } = useTurnoContext()

  return (
    <div 
      className={`c-sidebarCalendar ${ openCalendar ? `c-sidebarCalendar--open` : '' }`}
    >
      <Calendar/>
    </div>
  )
}

export default SidebarCalendar