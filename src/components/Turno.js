'use client'
import { useState, useRef, useEffect } from 'react'

// Icons
import { MdInsertComment } from "react-icons/md"
import { GiInfo } from "react-icons/gi"
import { IoMdArrowDropright } from "react-icons/io"
import { IoMdArrowDropdown } from "react-icons/io"
import Tooltip from '@/components_UI/Tooltip'
import PopUp from '@/components_UI/PopUp'
import Overlay from '@/components_UI/Overlay'
import Button from '@/components_UI/Button'
import { useTurnoContext } from '@/contexts/turno'

// Components


const estados = [
    'Reservado',
    'Esperando',
    'En Consulta',
    'Atendido',
    'Cancelado',
    'Ausente',
]

const Turno = ({ data = null, onlyView = false }) => {
    const [desplegable, setDesplegable] = useState(false)
    const [desplegableCSS, setDesplegableCSS] = useState({});
    const [currentTime, setCurrentTime] = useState(new Date());
    const botonRef = useRef(null);
    const desplegableRef = useRef(null);
    const { date, turno, setTurno, setOpenTurno } = useTurnoContext()

    const primeraLetraMayus = (string) => {
        let result = ''

        for(let palabra of string.split(' '))
            result += `${palabra.slice(0,1).toUpperCase()}${palabra.slice(1)} `

        return result.trim()
    }

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

    const editarEstado = ( nuevoEstado ) => {
        const editar = async (nuevoEstado) => {
            try {
                const response = await fetch(`${ process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL}/turnos/${data.id}`,
                    {
                        method: "PUT",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            authorization: "Bearer " + user.token,
                        },
                        body: JSON.stringify({ estado: nuevoEstado })
                    }
                )
                await response.json()
                //if(window) window.location.reload()
            } catch (error) { }
        }
        editar( nuevoEstado )
    }

    const handleModificarTurno = () => {
        setTurno((prev) => {
            return(
                {
                    ...prev,
                    fecha: date,
                    hora: data.horario,
                    id: data.id,
                    nombrePaciente: primeraLetraMayus(data.nombre),
                    nombreProfesional: primeraLetraMayus(data.doctor),
                    nombrePractica:  `${data.duracion}' - ${primeraLetraMayus(data.practica)}`,
                    nota: data.nota,
                    tipo: data.tipo,
                    onlyView: true,
                }
            )
        })
        setOpenTurno(true)
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

    /*useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);*/

    console.log(data);
    return (
        <>
            {
                onlyView &&
                <span className='u-m3--top'>{new Date(data.fecha).getDate()}/{new Date(data.fecha).getMonth() + 1}/{new Date(data.fecha).getFullYear()}</span>
            }
            <div 
                className={`
                    c-turno ${ onlyView ? 'c-turno--onlyView' : '' }
                    ${data.estado.toLowerCase() === 'esperando' && !onlyView ? 'c-turno--esperando' : ''}
                    ${data.estado.toLowerCase() === 'en consulta' && !onlyView ? 'c-turno--consulta' : ''}
                    ${data.estado.toLowerCase() === 'atendido' && !onlyView ? 'c-turno--atendido' : ''}
                    ${data.estado.toLowerCase() === 'ausente' && !onlyView ? 'c-turno--ausente' : ''}
                    ${data.estado.toLowerCase() === 'cancelado' && !onlyView ? 'c-turno--cancelado' : ''}
                `}
            >
                <div className='c-turno__horario'>
                    <div className={`c-turno__hora ${ data.tipo==="sobreturno" ? 'c-turno__hora--sobreturno' : '' } `}>
                        <GiInfo className='u-cursor'/>
                        {
                            data.nota &&
                            <Tooltip className={'u-flex-center-center'} text={data.nota}>
                                <MdInsertComment onClick={ handleModificarTurno } className='u-cursor'/>
                            </Tooltip>
                        }
                        <span onClick={ handleModificarTurno }>{data.horario}</span>
                    </div>
                    <div className='c-turno__div c-turno__informacion--column'>
                        <span>{haceTanto(data.ultimaModificacion)}</span>
                        <span>{data.estado}</span>
                    </div>
                </div>
                <div className='c-turno__paciente'>
                    <span className='c-turno__nombre'>{primeraLetraMayus(data.nombre)}</span>
                    <div className='c-turno__informacion'>
                        {
                            data.telefono &&
                            <>
                                <a class="c-turno__telefono" href={`http://web.whatsapp.com/send?phone=${data.telefono}`} target="_blank">{data.telefono}</a>
                                <a class="c-turno__telefono--mobile" href={`whatsapp://send?phone=${data.telefono}`} target="_blank">{data.telefono}</a>
                            </>
                        }
                        <span className='c-turno__dni'>{data.dni}</span>
                    </div>
                </div>
                <div className='c-turno__clinica'>
                    <div className='u-m3--right'>
                        <span className='c-turno__obra'>{primeraLetraMayus(data.obraSocial)}</span>
                    </div>
                    <div className='c-turno__doctor'>
                        <div className='c-turno__hora'>
                            <span className='u-text--bold'>Practica - {primeraLetraMayus(data.practica)}</span>
                        </div>
                        <div className='c-turno__div c-turno__informacion--column'>
                            <span className='u-text--bold'>{primeraLetraMayus(data.doctor)}</span>
                        </div>
                    </div>
                </div>
                {
                    !onlyView &&
                    <div className='c-turno__estado'>
                        <button ref={botonRef} onClick={() => setDesplegable( (prev) => !prev )}>
                            <IoMdArrowDropdown/>
                        </button>
                    </div>
                }
            </div>
            {
                !onlyView &&
                <div 
                    className={`c-turno__desplegable ${ desplegable ? 'c-turno__desplegable--open' : ''}`} 
                    ref={desplegableRef}
                    style={desplegableCSS}
                >
                    {
                        estados.map( (ele, index) => {
    
                            return(
                                <div className='c-turno__option' key={index} onClick={ () => editarEstado(ele) }>
                                    {ele.slice(0, 1).toUpperCase()}{ele.slice(1)}
                                </div>
                            )
                        })
                    }
                </div>
            }
        </>
    )
}

export default Turno