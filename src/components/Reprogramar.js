'use client'
// React
import React from 'react'

// Context
import { useTurnoContext } from '@/contexts/turno'

// Components
import Overlay from '@/components_UI/Overlay'
import PopUp from '@/components_UI/PopUp'
import Button from '@/components_UI/Button'


const Reprogramar = () => {
    const { reprogramando, setReprogramando } = useTurnoContext()

    
    const turnoParaEnviar = ( nuevaFecha, nuevoHorario ) => {
        let turnoParaEnviar = { }
        
        let aux = new Date(nuevaFecha.getFullYear(), nuevaFecha.getMonth(), nuevaFecha.getDate(), nuevoHorario.split(':')[0], nuevoHorario.split(':')[1])
        turnoParaEnviar.fecha_hora = aux.toISOString()

        return turnoParaEnviar
    }

    const reprogramar = async () => {
        try {
            setReprogramando({
                ...reprogramando,
                enCurso: true,
                error: false,
            })
            

        } catch (error) {
            setReprogramando({
                ...reprogramando,
                enCurso: false,
                error: true,
            })
        }
    }


    return (
        reprogramando &&
        <Overlay>
            <PopUp centered={true}>
                <div className='u-1/1 u-flex-column-start-center u-p3--vertical u-p4--horizontal'>
                    {
                    reprogramando && reprogramando.enCurso ?
                        <div className='u-1/1'><Loader text='Reprogramando...'/></div>
                    :
                        <>
                            reprogramando.nuevoHorario && !reprogramando.error &&
                                <>
                                    <p className='u-text--1 u-m2--bottom'>¿Seguro desea reprogramar?</p>
                                    <div className='u-1/1 u-flex-column-center-center u-text_align--start u-p4--vertical'>
                                        <p className='u-1/1'><span className='u-text--1 u-color--primary'>Profesional:</span> {filtros.profesional.apellido}, {filtros.profesional.nombre}</p>
                                        <p className='u-1/1'><span className='u-text--1 u-color--primary'>Fecha anterior:</span> {new Date(reprogramando.fecha).getDate()}/{new Date(reprogramando.fecha).getMonth() + 1}/{new Date(reprogramando.fecha).getFullYear()} {reprogramando.hora}</p>
                                        <p className='u-1/1'><span className='u-text--1 u-color--primary'>Fecha nueva:</span> {new Date(reprogramando.nuevoHorario.start).getDate()}/{new Date(reprogramando.nuevoHorario.start).getMonth() + 1}/{new Date(reprogramando.nuevoHorario.start).getFullYear()} {new Date(reprogramando.nuevoHorario.start).getHours().toString().padStart(2, '0')}:{new Date(reprogramando.nuevoHorario.start).getMinutes().toString().padStart(2, '0')}</p>
                                    </div>
                                    <div className='u-1/1 u-flex-center-center'>
                                        <Button 
                                            text={'Aceptar'} 
                                            clickHandler={
                                                () => {
                                                    reprogramar()
                                                }
                                            }
                                        />
                                        <Button text={'Cancelar'} clickHandler={() => setReprogramando({ ...reprogramando, nuevoHorario: null})}/>
                                    </div>
                                </>

                            reprogramando.error &&
                                <>
                                    <p className='u-text--1 u-m2--bottom'>
                                        !No se pudo asignar el turno en el horario seleccionado¡
                                    </p>
                                    <div className='u-1/1 u-flex-center-center'>
                                        <Button 
                                            text={'Continuar'} 
                                            clickHandler={
                                                () => {
                                                    setReprogramando({ ...reprogramando, error: null})
                                                }
                                            }
                                        />
                                    </div>
                                </>
                        </>
                    }
                </div>
            </PopUp>
        </Overlay>
    )
}

export default Reprogramar