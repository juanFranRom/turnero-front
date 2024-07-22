'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useUserContext } from './user'

const TurnoContext = createContext([])

export const useTurnoContext = () => useContext(TurnoContext)

const lenguaje = 'español'

export const TurnoContextProvider = ({ children }) => {
    const [turno, setTurno] = useState({
        pacienteText: '',
        pacienteList: [],
        paciente: null,
        profesionalText: '',
        profesionalList: [],
        profesional: null,
        practicasText: '',
        practicaText: '',
        practica: null,
        coberturaText: '',
        cobertura: null,
        fecha: null,
        hora: null
    })
    const [bloqueo, setBloqueo] = useState({
        profesionalText: '',
        profesionalList: [],
        profesional: null,
        fechaDesde: null,
        horaDesde: null,
        fechaHasta: null,
        horaHasta: null,
    })
    const [cancelandoBloqueo, setCancelandoBloqueo] = useState(null)
    const [filtros, setFiltros] = useState(typeof window !== 'undefined' && window.sessionStorage.getItem('filtros-innova') ?
            JSON.parse(window.sessionStorage.getItem('filtros-innova'))
        :
            {
                profesional: null,
                practica: null
            }
    )
    const [openTurno, setOpenTurno] = useState(false)
    const [openBloqueo, setOpenBloqueo] = useState(false)
    const [loadingTurnos, setLoadingTurnos] = useState(true)
    const [turnos, setTurnos] = useState([])
    const [reprogramando, setReprogramando] = useState(null)
    const [openCalendar, setOpenCalendar] = useState(false)
    const { user } = useUserContext()
    const [date, setDate] = useState(typeof window !== 'undefined' && window.sessionStorage.getItem('date-innova') ?
        new Date(window.sessionStorage.getItem('date-innova'))
    :
        new Date()
    )
    const pathname = usePathname()
    const diaSemana = lenguaje === 'español' ? 
            ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][date.getDay()] 
        :
            ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()] 
    const mes = lenguaje === 'español' ? mesesEspañol[date.getMonth()] : mesesIngles[date.getMonth()]
    const fechaFormateada = diaSemana + ' ' + date.getDate() + ' - ' + mes + ' ' + date.getFullYear()

    const reiniciarTurno = () => {
        setTurno({
            ...turno,
            pacienteText: '',
            pacienteList: [],
            paciente: null,
            practicasText: '',
            practicaText: '',
            practica: null,
            coberturaText: '',
            cobertura: null,
            fecha: null,
            hora: null,
            id: null,
        })
    }


    const buscarTurnos = async ( dia, profesional = null ) => {
        try {
            setLoadingTurnos(true)
            const response = await fetch(`${ process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL}/calendario/disponibilidad/1?fecha=${dia.getFullYear()}-${dia.getMonth() + 1}-${dia.getDate()}${profesional ? `&profesionales=${profesional.id}` : ''}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        authorization: "Bearer " + user.token,
                    }
                }
            )
            const json = await response.json()
            if (json.status === "SUCCESS") 
                setTurnos([...json.data[0].turnos])
            else
                setTurnos([])
            
            setLoadingTurnos(false)
        } catch (error) {
            setTurnos([])
            setLoadingTurnos(false)
            console.log(error);
        }
    }

    const cancelarBloqueo = async ( id ) => {
        try {
            setCancelandoBloqueo( true )
            const response = await fetch(`${ process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL}/bloqueo/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        authorization: "Bearer " + user.token,
                    }
                }
            )
            const json = await response.json()
            if(window) window.location.reload()
            setCancelandoBloqueo( false )
        } catch (error) {
            console.log(error);
            setCancelandoBloqueo( false )
        }
    }

    useEffect(() => {
        if(pathname.includes('agenda'))
            buscarTurnos( date, filtros.profesional ?? null )
    }, [date, filtros])

    useEffect(() => {
        if(window) 
        {
            window.sessionStorage.setItem('date-innova', date)
            window.sessionStorage.setItem('filtros-innova', JSON.stringify(filtros))
        }
    }, [date, filtros])

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
            turnos,
            turno,
            filtros,
            bloqueo,
            openBloqueo,
            cancelandoBloqueo,
            reprogramando,
            cancelarBloqueo,
            setReprogramando,
            setCancelandoBloqueo,
            setOpenBloqueo,
            setBloqueo,
            setFiltros,
            setTurno,
            setLoadingTurnos,
            setOpenCalendar,
            setDate,
            setOpenTurno,
            reiniciarTurno,
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
