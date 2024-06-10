'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const TurnoContext = createContext([])

export const useTurnoContext = () => useContext(TurnoContext)

const lenguaje = 'español'

export const TurnoContextProvider = ({ children }) => {
    const [openTurno, setOpenTurno] = useState(false)
    const [loadingTurnos, setLoadingTurnos] = useState(true)
    const [turnos, setTurnos] = useState([])
    const [openCalendar, setOpenCalendar] = useState(false)
    const [date, setDate] = useState(new Date())
    const diaSemana = lenguaje === 'español' ? 
            ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][date.getDay()] 
        :
            ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()] 
    const mes = lenguaje === 'español' ? mesesEspañol[date.getMonth()] : mesesIngles[date.getMonth()]
    const fechaFormateada = diaSemana + ' ' + date.getDate() + ' - ' + mes + ' ' + date.getFullYear()

    useEffect(() => {
        setLoadingTurnos(false)
    }, [date])

    return (
        <TurnoContext.Provider value={{
            openCalendar,
            date,
            diasEspañol,
            diasIngles,
            mesesEspañol,
            mesesIngles,
            fechaFormateada,
            lenguaje,
            openTurno,
            loadingTurnos,
            setLoadingTurnos,
            setOpenCalendar,
            setDate,
            setOpenTurno,
        }}>
            { children }
        </TurnoContext.Provider>
    )
}

const diasEspañol = [
    'Dom',
    'Lun',
    'Mar',
    'Mie',
    'Jue',
    'Vie',
    'Sab',
]

const diasIngles = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
]

const mesesEspañol = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

const mesesIngles = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const data = [{
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
    },
    {
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
    }
]
