'use client'
import { useState, useRef, useEffect } from 'react'

// Icons
import { MdInsertComment } from "react-icons/md"
import { GiInfo } from "react-icons/gi"
import { IoMdArrowDropright } from "react-icons/io"
import { IoMdArrowDropdown } from "react-icons/io"

const estados = [
    'reservado',
    'esperando',
    'en consulta',
    'atendido',
    'cancelado',
    'ausente',
]

const Turno = ({ data = null }) => {
    const [turno, setTurno] = useState( !data ? {
        nombre: 'chulia, victor',
        horario: '08:00',
        telefono: '+54 266 400 4568',
        dni: '13.608.654',
        obraSocial: 'DOSEP - Inclusion Social',
        tipo: 'Consulta',
        practica: 'CONSULTA ODONTOLOGICA (INCLUYE FICHADO Y PRIMERA CONSULTA)',
        doctor: 'Portela, Judith Lilian',
        estado: 'ausente',
        ultimaModificacion: new Date(2024, 4, 16, 19, 18, 0)
    } : data )
    const [desplegable, setDesplegable] = useState(false)
    const [desplegableCSS, setDesplegableCSS] = useState({});
    const botonRef = useRef(null);
    const desplegableRef = useRef(null);


    const haceTanto = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffInMilliseconds = now - past;
    
        const seconds = Math.floor(diffInMilliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
    
        if (years > 0) {
            return years === 1 ? "hace 1 año" : `hace ${years} años`;
        } else if (months > 0) {
            return months === 1 ? "hace 1 mes" : `hace ${months} meses`;
        } else if (days > 0) {
            return days === 1 ? "hace 1 día" : `hace ${days} días`;
        } else if (hours > 0) {
            return hours === 1 ? "hace 1 hora" : `hace ${hours} horas`;
        } else if (minutes > 0) {
            return minutes === 1 ? "hace 1 minuto" : `hace ${minutes} minutos`;
        } else {
            return seconds === 1 ? "hace 1 segundo" : `hace ${seconds} segundos`;
        }
    }

    const handleClickOutside = (event) => {
        if (
            desplegableRef.current && 
            !desplegableRef.current.contains(event.target) &&
            botonRef.current && 
            !botonRef.current.contains(event.target)
        ) {
            setDesplegable(false);
        }
    }

    useEffect(() => {

        if (desplegable && botonRef.current && desplegableRef.current) 
        {
            const buttonRect = botonRef.current.getBoundingClientRect();
            setDesplegableCSS({
                top: `${buttonRect.bottom}px`,
                left: `${buttonRect.right - desplegableRef.current.offsetWidth}px`
            });
            document.addEventListener('mousedown', handleClickOutside);
        } 
        else 
            document.removeEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }

    }, [desplegable]);

    return (
        <>
            <div 
                className={`
                    c-turno 
                    ${turno.estado.toLowerCase() === 'esperando' ? 'c-turno--esperando' : ''}
                    ${turno.estado.toLowerCase() === 'consulta' ? 'c-turno--consulta' : ''}
                    ${turno.estado.toLowerCase() === 'atendido' ? 'c-turno--atendido' : ''}
                    ${turno.estado.toLowerCase() === 'ausente' ? 'c-turno--ausente' : ''}
                    ${turno.estado.toLowerCase() === 'cancelado' ? 'c-turno--cancelado' : ''}
                `}
            >
                <div className='c-turno__horario'>
                    <div className='c-turno__hora'>
                        <GiInfo className='u-cursor'/>
                        <MdInsertComment className='u-cursor'/>
                        <span>{turno.horario}</span>
                    </div>
                    <div className='c-turno__div c-turno__informacion--column'>
                        <span>{haceTanto(turno.ultimaModificacion)}</span>
                        <span>{turno.estado}</span>
                    </div>
                </div>
                <div className='c-turno__paciente'>
                    <span className='c-turno__nombre'>{turno.nombre}</span>
                    <div className='c-turno__informacion'>
                        <span className='c-turno__telefono'>{turno.telefono}</span>
                        <span className='c-turno__dni'>{turno.dni}</span>
                    </div>
                </div>
                <div className='c-turno__clinica'>
                    <div className='u-m3--right'>
                        <span className='c-turno__obra'>{turno.obraSocial}</span>
                    </div>
                    <div className='c-turno__doctor'>
                        <div className='c-turno__hora'>
                            <span className='u-text--bold'>{turno.tipo}</span>
                            <span className='c-turno__text--secondary'>{turno.practica}</span>
                        </div>
                        <div className='c-turno__div c-turno__informacion--column'>
                            <span className='u-text--bold'>{turno.doctor}</span>
                        </div>
                    </div>
                </div>
                <div className='c-turno__estado'>
                    <button>
                        Siguiente estado
                        <IoMdArrowDropright/>
                    </button>
                    <button ref={botonRef} onClick={() => setDesplegable( (prev) => !prev )}>
                        <IoMdArrowDropdown/>
                    </button>
                </div>
            </div>
            <div 
                className={`c-turno__desplegable ${ desplegable ? 'c-turno__desplegable--open' : ''}`} 
                ref={desplegableRef}
                style={desplegableCSS}
            >
                {
                    estados.map( (ele, index) => {

                        return(
                            <div className='c-turno__option' key={index}>
                                {ele.slice(0, 1).toUpperCase()}{ele.slice(1)}
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Turno