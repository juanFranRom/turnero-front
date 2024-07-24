'use client'
// React
import React, { useState, useRef, useEffect } from 'react'

// Contexts
import { useTurnoContext } from '@/contexts/turno'
import { useUserContext } from '@/contexts/user'

// Icons
import { CiLock } from "react-icons/ci"
import { FaLock } from "react-icons/fa"
import { FaLockOpen } from "react-icons/fa"

// Components
import Loader from '@/components_UI/Loader'
import Overlay from '@/components_UI/Overlay'
import PopUp from '@/components_UI/PopUp'
import Button from '@/components_UI/Button'


const generateIntervals = (start, end, interval) => {
    const times = []
    let currentTime = new Date(start.getTime())

    while (currentTime <= end) {
        const hours = String(currentTime.getHours()).padStart(2, '0')
        const minutes = String(currentTime.getMinutes()).padStart(2, '0')
        times.push({ tipo: 'disponibilidad', text: `${hours}:${minutes}` })
        currentTime.setMinutes(currentTime.getMinutes() + interval)
    }

    return times
}

const getWeekDays = (fecha) => {
    const today = fecha
    const days = []
    const intervals = generateIntervals(new Date(today.setHours(8, 0, 0)), new Date(today.setHours(20, 30, 0)), 10) // 10 minutos de intervalo
    const options = { weekday: 'long' }

    let count = 0
    while (days.length < 7) {
        const date = new Date(today)
        date.setDate(today.getDate() + count)
        const dayName = date.toLocaleDateString('es-ES', options)

        if (dayName !== 'sábado' && dayName !== 'domingo') {
            days.push({ nombre: dayName, fecha: new Date(date), intervalos: [...intervals] })
        }
        count++
    }

    return days
}

const primeraLetraMayus = (string) => {
    let result = ''

    for(let palabra of string.split(' '))
        result += `${palabra.slice(0,1).toUpperCase()}${palabra.slice(1)} `

    return result.trim()
}


const Calendario = () => {
    const [visibleDays, setVisibleDays] = useState(null)
    const calendarRef = useRef(null)
    const { dias, mesesEspañol, setTurno, openTurno, setOpenTurno, filtros, setBloqueo, setOpenBloqueo, setCancelandoBloqueo, reprogramando, setReprogramando } = useTurnoContext()

    const handleTurno = (day, interval) => {
        setOpenBloqueo(false)
        if(interval.tipo === 'disponibilidad')
        {
            console.log(interval.hora)
            setTurno((prev) => {
                return(
                    {
                        ...prev,
                        fecha: day.fecha,
                        hora: interval.hora,
                        id: null,
                    }
                )
            })
        }
        else
            setTurno((prev) => {
                return(
                    {
                        ...prev,
                        fecha: day.fecha,
                        hora: interval.hora,
                        id: interval.id,
                        nombrePaciente: primeraLetraMayus(interval.nombre),
                        nombreProfesional: primeraLetraMayus(interval.doctor),
                        nombrePractica: `${interval.duracion}' - ${primeraLetraMayus(interval.practica)}`,
                        nota: interval.nota,
                        tipo: interval.tipo,
                        onlyView: false
                    }
                )
            })
        setOpenTurno(true)
    }

    const handleReprogramar = (interval) => {
        setReprogramando({
            ...reprogramando,
            nuevoHorario: {...interval}
        })
    }

    const handleBloqueo = (e, day, interval) => {
        e.stopPropagation()

        if(!day)
        {
            setCancelandoBloqueo(interval)
            return
        }

        setOpenTurno(false)
        if(interval && interval.tipo === 'disponibilidad')
            setBloqueo((prev) => {
                return(
                    {
                        profesional: filtros.profesional,
                        fechaDesde: day.fecha,
                        horaDesde: interval.hora,
                        fechaHasta: day.fecha,
                        horaHasta: interval.text.slice(interval.text.length - 5)
                    }
                )
            })
        else
            setBloqueo((prev) => {
                return(
                    {
                        profesional: filtros.profesional,
                        fechaDesde: day.fecha,
                        horaDesde: '00:00',
                        fechaHasta: day.fecha,
                        horaHasta: '23:59',
                    }
                )
            })

        setOpenBloqueo(true)
    }

    useEffect(() => {
        const handleResize = () => {
            if (calendarRef.current && dias) {
                const calendarWidth = calendarRef.current.offsetWidth
                const minWidthPerDay = 160 + 70 // Ancho mínimo por columna
                const maxVisibleDays = Math.min(Math.floor(calendarWidth / minWidthPerDay), 5)
                let aux = []

                for(let dia of dias)
                {
                    if(dia.intervalos && dia.intervalos.length > 0)
                        aux.push(dia)
                    
                    if(maxVisibleDays === aux.length)
                        break
                }

                setVisibleDays(aux)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [dias, calendarRef.current?.offsetWidth, openTurno])

    
    
    return (
        <>
            {
                reprogramando &&
                <div className='c-reprogramandoPopUp' onClick={() =>{setReprogramando(null)}}>
                    <p className='c-reprogramandoPopUp__text'>Reprogramando</p>
                    <p className='c-reprogramandoPopUp__hover'>Cancelar</p>
                </div>   
            }
            <div className='c-daily_calendar' ref={calendarRef}>
                {
                    dias && visibleDays ?
                        <>
                            <div className="c-daily_calendar__header">
                                {
                                    visibleDays.map((day, index) => (
                                        day.intervalos && day.intervalos.length > 0 ?
                                            <div key={index} className="c-daily_calendar__day_header">
                                                {
                                                    !reprogramando && !day.intervalos.find(el => el.tipo === 'turno' || el.tipo === 'sobreturno') &&
                                                    <FaLock className='c-daily_calendar__lock' onClick={(e) => handleBloqueo(e, day, null)}/>
                                                }
                                                <div>
                                                    {day.fecha.getDate()} 
                                                </div>
                                                <div className='u-flex-column-center-start'>
                                                    <p>
                                                        {`${day.nombre.charAt(0).toUpperCase()}${day.nombre.slice(1)}`}
                                                    </p>
                                                    <p>
                                                    {`${mesesEspañol[day.fecha.getMonth()].charAt(0).toUpperCase()}${mesesEspañol[day.fecha.getMonth()].slice(1)}`}{}
                                                    </p>
                                                </div>
                                            </div>
                                        :
                                            <></>
                                    ))
                                }
                            </div>
                            <div className="c-daily_calendar__body">
                                {visibleDays.map((day, dayIndex) => (
                                    day.intervalos && day.intervalos.length > 0 ?
                                        <div key={dayIndex} className="c-daily_calendar__day_column">
                                            {
                                                    day.intervalos.map((interval, index) => {
                                                        if(interval.tipo ==="disponibilidad"){
                                                            return (
                                                                <div key={index} className="c-daily_calendar__day_cell" onClick={() => !reprogramando ? handleTurno(day, interval) : handleReprogramar(interval)}>
                                                                    <div className="c-daily_calendar__time_cell">
                                                                        {interval.text.slice(0, 5)} 
                                                                    </div>
                                                                    {
                                                                        !reprogramando &&
                                                                        <div className="c-daily_calendar__data_cell">
                                                                            <FaLock className='c-daily_calendar__lock' onClick={(e) => handleBloqueo(e, day, interval)}/>
                                                                        </div> 
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                        else if(interval.tipo==="bloqueo"){
                                                            //ponerle un colorcito rojo
                                                            return (
                                                                <div key={index} className="c-daily_calendar__day_cell">
                                                                    <div className="c-daily_calendar__time_cell">
                                                                        {new Date(interval.start).getHours().toString().padStart(2, '0')}:{new Date(interval.start).getMinutes().toString().padStart(2, '0')}
                                                                    </div>
                                                                    <div className="c-daily_calendar__data_cell">
                                                                        <FaLockOpen className='c-daily_calendar__lock_open' onClick={(e) => !reprogramando ? handleBloqueo(e, null, interval) : null }/>
                                                                    </div> 
                                                                </div>
                                                            )
                                                        } 
                                                        else  {
                                                            return (
                                                                <div key={index} className="c-daily_calendar__day_cell" onClick={ () => !reprogramando ? handleTurno(day, interval) : null }>
                                                                    <div className={`c-daily_calendar__time_cell ${ interval.tipo==="sobreturno" ? 'c-daily_calendar__time_cell--sobreturno' : '' } `}>
                                                                        {interval.text.slice(0, 5)} 
                                                                    </div>
                                                                    <div className="c-daily_calendar__data_cell">
                                                                        <p>{primeraLetraMayus(interval.nombre)}</p>
                                                                        <p>{interval.duracion}' - {primeraLetraMayus(interval.practica)}</p>
                                                                    </div> 
                                                                </div>
                                                            )
                                                        }
                                                    })
                                            }
                                        </div>
                                    :
                                        <></>
                                ))}
                            </div>
                        </>
                    :
                    <div className='u-1/1 u-p5--vertical u-flex-center-center'>
                        <Loader text='Cargando turnos...'/>
                    </div>
                }

            </div>
        </>
    )
}

export default Calendario