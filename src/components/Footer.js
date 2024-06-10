'use client'
// Context
import { useSideBarContext } from '@/contexts/sidebar'  

const Footer = () => {
  const { open } = useSideBarContext()
    return (
      <footer className={`c-footer ${open && 'c-footer--active'}`}>
        <p className='c-footer--copyright'>Copyright © 2024 </p>
        <a className='c-footer--link' href='https://www.cilmateriales.com.ar/'> CIL </a>
        Todos los derechos reservados.
      </footer>
    )
}

export default Footer