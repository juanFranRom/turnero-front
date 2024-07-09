// React
import React, { useState } from 'react'

// Components
import Input from '@/components_UI/Input'


const HorariosSemanales = () => {
    const [programacion, setProgramacion] = useState({})
    const [diasSeleccionados, setDiasSeleccionados] = useState([])

    const manejoCambioDia = (day) => {
        if (diasSeleccionados.includes(day)) {
            setDiasSeleccionados(diasSeleccionados.filter(d => d !== day))
            const nuevaProgramacion = { ...programacion }
            delete nuevaProgramacion[day]
            setProgramacion(nuevaProgramacion)
        } else {
            setDiasSeleccionados([...diasSeleccionados, day])
            setProgramacion({
                ...programacion,
                [day]: [{ start: '', end: '' }] 
            })
        }
    }

    const manejoAgregarTiempo = (day) => {
        setProgramacion({
            ...programacion,
            [day]: [...programacion[day], { start: '', end: '' }]
        })
    }

    const manejoQuitarTiempo = (dia, indice) => {
        const nuevoTiempo = programacion[dia].filter((_, i) => i !== indice)
        setProgramacion({
            ...programacion,
            [dia]: nuevoTiempo
        })
    }

    const manejoCambioTiempo = (dia, indice, tipo, valor) => {
        const nuevoTiempo = programacion[dia].map((slot, i) =>
            i === indice ? { ...slot, [tipo]: valor } : slot
        )
        setProgramacion({
            ...programacion,
            [dia]: nuevoTiempo
        })
    }

    const dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const nombresDias = {
        'L': 'Lunes',
        'M': 'Martes',
        'X': 'Miércoles',
        'J': 'Jueves',
        'V': 'Viernes',
        'S': 'Sábado',
        'D': 'Domingo'
    };


    return (
        <div className="c-horario_semanal">
            <div className="c-horario_semanal__dias">
                {
                    dias.map((dia) => (
                        <button
                            key={dia}
                            className={diasSeleccionados.includes(dia) ? 'selected' : ''}
                            onClick={() => manejoCambioDia(dia)}
                        >
                            {dia}
                        </button>
                    ))
                }
            </div>
            <div className="c-horario_semanal__programacion">
                {
                    diasSeleccionados.map((dia) => (
                        <div key={dia}>
                            <p className='u-p2--vertical'>{nombresDias[dia]}</p>
                            {
                                programacion[dia].map((slot, index) => (
                                    <div key={index} className="c-horario_semanal__dia">
                                        <Input
                                            type="time"
                                            defaultValue={slot.start}
                                            handleChange={(val) => manejoCambioTiempo(dia, index, 'start', val)}
                                        />
                                        a
                                        <Input
                                            type="time"
                                            defaultValue={slot.end}
                                            handleChange={(val) => manejoCambioTiempo(dia, index, 'start', val)}
                                        />
                                        {
                                            index === programacion[dia].length - 1 && (
                                                <>
                                                    <button onClick={() => manejoAgregarTiempo(dia)}> + </button>
                                                    <button onClick={() => manejoQuitarTiempo(dia, index)}> - </button>
                                                </>
                                            )
                                        }
                                    </div>
                                ))
                            }
                            {
                                programacion[dia].length === 0 && (
                                    <button onClick={() => manejoAgregarTiempo(dia)}> + </button>
                                )
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default HorariosSemanales
