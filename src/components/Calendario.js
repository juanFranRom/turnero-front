'use client'
// React
import React, { useState, useRef, useEffect } from 'react'

// Contexts
import { useTurnoContext } from '@/contexts/turno'

// Icons
import { CiLock } from "react-icons/ci"

// Components
import Loader from '@/components_UI/Loader'

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


const Calendario = () => {
    const [dias, setDias] = useState(null)
    const [visibleDays, setVisibleDays] = useState(null)
    const calendarRef = useRef(null)
    const { date, mesesEspañol, turno, setTurno, openTurno, setOpenTurno, filtros, setFiltros } = useTurnoContext()

    const handleTurno = (day, interval) => {
        console.log(day, interval);
        setTurno((prev) => {
            return(
                {
                    ...prev,
                    fecha: day.fecha,
                    hora: interval.hora
                }
            )
        })
        setOpenTurno(true)
    }


    useEffect(() => {
        setDias(getWeekDays(date))
    },[date])

    useEffect(() => {
        const handleResize = () => {
            if (calendarRef.current && dias) {
                const calendarWidth = calendarRef.current.offsetWidth
                const minWidthPerDay = 220 + 70 // Ancho mínimo por columna
                const maxVisibleDays = Math.floor(calendarWidth / minWidthPerDay)
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

    useEffect(() => {
        const buscarTurnos = async ( dia, profesional ) => {
            try {
                const response = await fetch(`${ process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL}/calendario/disponibilidad/mes?fecha=${dia.getFullYear()}-${dia.getMonth() + 1}-${dia.getDate()}&profesionales=${profesional.id}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            /*authorization: "Bearer " + user.token,*/
                        }
                    }
                )
                const json = await response.json()
                if (json.status === "SUCCESS") {
                    console.log(json);
                    let option =  { weekday: 'long' };
                    let aux = json.data.map(day=>{
                        let [year,month,dia] = day.dia.split('-');
                        let fecha = new Date(year,parseInt(month)-1,dia,0,0,0);
                        const dayName = fecha.toLocaleDateString('es-ES',option)
                        return{
                            nombre:dayName,
                            fecha,
                            intervalos: day.list.sort((a, b) => {
                                if (a.hora < b.hora) return -1;
                                if (a.hora > b.hora) return 1;
                                // Si las horas son iguales, ordenamos por tipo
                                if (a.hora === b.hora) {
                                    if (a.tipo === 'turno' && b.tipo === 'sobreturno') return -1;
                                    if (a.tipo === 'sobreturno' && b.tipo === 'turno') return 1;
                                }
                                return 0;
                            })
                        }
                    });
                    setDias(aux)
                }
            } catch (error) {
                console.log(error);
            }
        }
        if(filtros.profesional)
        {
            buscarTurnos(date, filtros.profesional)
        }
        else
            setDias(getWeekDays(date ?? new Date()))
    },[date, filtros])
    
    return (
        <div className='c-daily_calendar' ref={calendarRef}>
            {
                dias && visibleDays ?
                    <>
                        <div className="c-daily_calendar__header">
                            {
                                visibleDays.map((day, index) => (
                                    day.intervalos && day.intervalos.length > 0 ?
                                        <div key={index} className="c-daily_calendar__day_header">
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
                                                    if(interval.tipo==="disponibilidad"){
                                                        return (
                                                            <div key={index} className="c-daily_calendar__day_cell" onClick={() => handleTurno(day, interval)}>
                                                                <div className="c-daily_calendar__time_cell">
                                                                    {interval.text.slice(0, 5)} 
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    else if(interval.tipo==="bloqueo"){
                                                        //ponerle un colorcito rojo
                                                        return (
                                                            <div key={index} className="c-daily_calendar__day_cell" onClick={() => handleTurno(day, interval)}>
                                                                <div className="c-daily_calendar__time_cell">
                                                                    <CiLock/>
                                                                </div>
                                                                <div className="c-daily_calendar__time_cell">
                                                                    {interval.horario}
                                                                </div>
                                                                <div className="c-daily_calendar__time_cell">
                                                                    {interval.duracion}
                                                                </div>
                                                            </div>
                                                        )
                                                    } 
                                                    else {
                                                        return (
                                                            <div key={index} className="c-daily_calendar__day_cell" onClick={() => handleTurno(day, interval)}>
                                                                <div className={`c-daily_calendar__time_cell ${ interval.tipo==="sobreturno" ? 'c-daily_calendar__time_cell--sobreturno' : '' } `}>
                                                                    {interval.text.slice(0, 5)} 
                                                                </div>
                                                                <div className="c-daily_calendar__data_cell">
                                                                    <p>{interval.nombre}</p>
                                                                    <p>{interval.duracion}' - {interval.practica}</p>
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
    )
}

export default Calendario