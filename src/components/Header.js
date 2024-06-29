'use client'
// NEXT JS COMPONENT
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

// Components
import ToggleSwitch from '@/components_UI/ToggleSwitch';
import ContextMenu from '@/components_UI/ContextMenu';

// React Icons
import { FaBars } from 'react-icons/fa'
import { FaPowerOff } from "react-icons/fa6"
import { FaPlusSquare } from "react-icons/fa"

// Contexts
import { useSideBarContext } from '@/contexts/sidebar'
import { useUserContext } from '@/contexts/user'
import { useTurnoContext } from '@/contexts/turno'
import { usePacienteContext } from '@/contexts/paciente'

const Header = ( ) => {
    const [menuTurno, setMenuTurno] = useState(false)
    const [coordenadas, setCoordenadas] = useState({
        x: null,
        y: null
    })
    const { setOpen } = useSideBarContext()
    const { logOut } = useUserContext()
    const { setOpenTurno, setOpenCalendar, openCalendar } = useTurnoContext()
    const { setOpenPaciente } = usePacienteContext()
    const pathname = usePathname()

    useEffect(() => {
        if(pathname.length > 1)
            setOpenCalendar(false)
        else
            setOpenCalendar(true)
    }, [pathname])

    return (
        <header className='c-header'>
            <div className='u-flex-center-center'>
                {
                    pathname.length <= 1 &&
                    <ToggleSwitch setEstado={setOpenCalendar} estado={ openCalendar }/>
                }
                <FaPlusSquare 
                    id='newTurno' 
                    className='u-color--white u-text--4 u-cursor--pointer u-m3--left' 
                    onClick={(e) => {
                        const rect = e.target.getBoundingClientRect();
                        setCoordenadas({
                            x: rect.left,
                            y: rect.bottom + 5,
                        })
                        setMenuTurno(prev => !prev)
                    }}
                />
                <Link className='c-header__link' href={'/'}>
                    <span>Inicio</span>
                </Link>
                <Link className='c-header__link' href={'/paciente'}>
                    <span>Pacientes</span>
                </Link>
                <Link className='c-header__link' href={'/profesional'}>
                    <span>Profesionales</span>
                </Link>
                {
                    menuTurno &&
                    <ContextMenu x={coordenadas.x} y={coordenadas.y} setContextMenu={setMenuTurno}>
                        <div className="c-context_menu--item" onClick={() => { setOpenTurno(prev => !prev); setMenuTurno(prev => !prev); }}>
                            <span className="u-6/7">Nuevo Turno</span>
                        </div>
                        <div className="c-context_menu--item" onClick={() => { setOpenPaciente(prev => !prev); setMenuTurno(prev => !prev); }}>
                            <span className="u-6/7">Nuevo Paciente</span>
                        </div>
                    </ContextMenu>
                }
            </div>
            <Link href={'/'}>
                <Image className={'c-header__logo'} src={"/innova/imagenes/iso.png"} width={1422} height={1661} alt='logo'/>
            </Link>
            <div className='u-flex-center-center'>
                <FaBars className='c-header__menu u-m3--right' onClick={() => setOpen((prevState) => !prevState)}/>
                <FaPowerOff className='c-header__cerrarSesion'  onClick={logOut}/>
            </div>
        </header>
    )
}

export default Header