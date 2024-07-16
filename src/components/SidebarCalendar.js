'use client'
// React
import { useEffect } from 'react'

// Contexts
import { useTurnoContext } from '@/contexts/turno'

// Icons
import { IoMdClose } from "react-icons/io"

// Components
import Calendar from '@/components_UI/Calendar'
import Datalist from '@/components_UI/Datalist'

const SidebarCalendar = ({  }) => {
  const { openCalendar, turno, setTurno, filtros, setFiltros } = useTurnoContext()

  const minutesToTime = (duracion) => {
    let hours = Math.floor( duracion/60 )
    if(hours <= 9)
      hours = "0"+hours

    let minutes = duracion%60

    if(minutes <= 9)
      minutes= "0"+minutes

    return `${hours}:${minutes}`
  }

  const buscar = async ( ) => {
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
          setTurno({
            ...turno,
            profesionalList: json.data.reduce((acc, profesional) => {
              profesional.clinicas.forEach(clinica => {
                const newProfessional = {
                  ...profesional,
                  clinica: clinica,
                  value: `${profesional.apellido}, ${profesional.nombre} (${clinica.nombre})`
                }
                acc.push(newProfessional)
              })
              return acc
            }, []).sort((a, b) => {
              return a.value.localeCompare(b.value);
            })
          })
      } 
    } catch (error) {
      console.log(error)
    }
  }

  const handleDatalist = (val, key) => {
    if(typeof val === 'string')
      setTurno({
        ...turno,
        [`${key}Text`]: val
      })
    else
    {
      setTurno({
        ...turno,
        [`${key}Text`]: val.value,
        [`${key}`]: val,
      })
      setFiltros({
        ...filtros,
        [`${key}`]: val,
      })
    }
  }

  const limpiarDatalist = (key) => {
    setTurno({
      ...turno,
      [`${key}Text`]: '',
      [`${key}`]: null,
    })
    setFiltros({
      ...filtros,
      [`${key}`]: null,
    })
  }

  useEffect(() => {
    buscar()
  }, [turno.profesionalText])

  return (
    <div 
      className={`c-sidebarCalendar ${ openCalendar ? `c-sidebarCalendar--open` : '' }`}
    >
      <Calendar/>
      <div className='c-sidebarCalendar__item'>
        <span>Profesional</span>
        <div className={'u-1/1 u-flex-center-center'}>
          <Datalist
            list={ turno.profesionalList } 
            defaultOption={ typeof filtros.profesional === 'string' ? { value: filtros.profesional } : filtros.profesional} 
            setter={(val) => handleDatalist(val, "profesional")}
          />
          <IoMdClose className='u-color--red u-cursor--pointer' onClick={() => limpiarDatalist("profesional")}/>
        </div>
      </div>
      {/*
        turno.profesional &&
        <div className='c-sidebarCalendar__item'>
          <span>Practica</span>
          <div className={'u-1/1 u-flex-center-center'}>
            <Datalist
              className={'u-1/1'}
              list={ turno.profesional.practicas.map((el) => { return ({ ...el.practica, value: `${el.practica.nombre} (${minutesToTime(el.duracion)})` }) }) } 
              defaultOption={ { value: turno.practicaText } } 
              setter={(val) => handleDatalist(val, "practica")}
            />
            <IoMdClose className='u-color--red u-cursor--pointer' onClick={() => limpiarDatalist("practica")}/>
          </div>
        </div>
      */}
    </div>
  )
}

export default SidebarCalendar