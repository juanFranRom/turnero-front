'use client'
// React
import { useState } from 'react'

// components
import Overlay from '@/components_UI/Overlay'
import Datalist from '@/components_UI/Datalist'

// context
import { useTurnoContext } from '@/contexts/turno'

// Icons
import { IoMdClose } from "react-icons/io"
import DatepickerComponent from '@/components_UI/DatePicker'
import TimePicker from '@/components_UI/TimePicker'
import Button from '@/components_UI/Button'


const NuevoTurno = () => {
    const { openTurno, setOpenTurno } = useTurnoContext()

    return (
        <>
            {
                openTurno &&
                <Overlay>
                    <div className='c-nuevo_turno'>
                        <IoMdClose className='u-cursor--pointer u-text--1 u-fixed--top_right' onClick={() => setOpenTurno( prev => !prev )}/>
                        <h2 className='u-color--primary'>Turno</h2>
                        <div className='c-nuevo_turno__item'>
                            <div>
                                <span>Paciente</span>
                                <Datalist/>
                            </div>
                        </div>
                        <div className='c-nuevo_turno__item'>
                            <div>
                                <span>Profesional</span>
                                <Datalist/>
                            </div>
                        </div>
                        <div className='c-nuevo_turno__item'>
                            <div>
                                <span>Practica</span>
                                <Datalist/>
                            </div>
                        </div>
                        <div className='c-nuevo_turno__item'>
                            <div>
                                <span>Obra Social</span>
                                <Datalist/>
                            </div>
                        </div>
                        <div className='c-nuevo_turno__item c-nuevo_turno__hora'>
                            <div className=''>
                                <span>Fecha</span>
                                <DatepickerComponent/>
                            </div>
                            <div className=''>
                                <span>hora</span>
                                <TimePicker/>
                            </div>
                        </div>
                        <div className='c-nuevo_turno__item c-nuevo_turno__item--right'>
                            <Button text={'Dar turno'}/>
                        </div>
                        <div className='c-nuevo_turno__item c-nuevo_turno__item--right'>
                            <Button className={''} text={'Bloquear Horario'}/>
                        </div>
                    </div>
                </Overlay>
            }
        </>
    )
}

export default NuevoTurno