'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useUserContext } from './user'

const TurnoContext = createContext([])

export const useTurnoContext = () => useContext(TurnoContext)

const lenguaje = 'español'


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
    const [dias, setDias] = useState(null)
    const [profesionales, setProfesionales] = useState( [] )
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
            onlyView: false
        })
    }

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

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
            //if(window) window.location.reload()
            setCancelandoBloqueo( false )
        } catch (error) {
            console.log(error);
            setCancelandoBloqueo( false )
        }
    }

    const buscarProfesionales = async ( ) => {
        try {
            const response = await fetch(`${ process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL}/profesionales`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        authorization: "Bearer " + user.token,
                    },
                }
            )
            const json = await response.json()
            if (json.status === "SUCCESS") {
                if(json.data.length && json.data.length > 0)
                    setProfesionales(
                        json.data.reduce((acc, profesional) => {
                            profesional.clinicas.forEach(clinica => {
                                const newProfessional = {
                                    ...profesional,
                                    clinica: clinica,
                                    value: `${capitalizeFirstLetter(profesional.apellido)}, ${capitalizeFirstLetter(profesional.nombre)} (${capitalizeFirstLetter(clinica.nombre)})`
                                }
                                acc.push(newProfessional)
                            })
                            return acc
                        }, []).sort((a, b) => {
                            return a.value.localeCompare(b.value);
                        })
                    )
            } 
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(user)
            buscarProfesionales()
    }, [user])

    useEffect(() => {
        if(pathname.includes('agenda') && user)
            buscarTurnos( date, filtros.profesional ?? null )
    }, [date, filtros, pathname, user])

    useEffect(() => {
        const buscarTurnosCalendario = async ( dia, profesional ) => {
            try {
                const response = await fetch(`${ process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL}/calendario/disponibilidad/5?fecha=${dia.getFullYear()}-${dia.getMonth() + 1}-${dia.getDate()}&profesionales=${profesional.id}`,
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
                if (json.status === "SUCCESS") {
                    let option =  { weekday: 'long' };
                    let aux = json.data.map(day=>{
                        let [year,month,dia] = day.dia.split('-');
                        let fecha = new Date(year,parseInt(month)-1,dia,0,0,0);
                        const dayName = fecha.toLocaleDateString('es-ES',option)
                        return{
                            nombre:dayName,
                            fecha,
                            intervalos: day.list.map(ele => ({ ...ele })).sort((a, b) => {
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

        if(pathname === '/' && user)
        {
            if(filtros.profesional)
                buscarTurnosCalendario(date, filtros.profesional)
            else
                setDias(getWeekDays(date ?? new Date()))
        }
    },[date, filtros, pathname, user])

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
            dias,
            profesionales,
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
