'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Context
import { useUserContext } from '@/contexts/user'

// Components
import Button from '@/components_UI/Button'
import ProtectedPath from '@/components/ProtectedPath'
import Input from '@/components_UI/Input'
import Select from '@/components_UI/Select'
import Loader from '@/components_UI/Loader'

const page = ({ params }) => {
  const [data, setData] = useState({
    username: '',
    nombre: '',
    clinica: '',
    telefono: '',
    email: '',
    rol: { id:1, value: 'Secretaria' }
  })
  const [error, setError] = useState({
      value: false,
      mensaje: '',
  })
  const [accion, setAccion] = useState({
      text: '',
      value: false
  })
  const [loading, setLoading] = useState( params.id ? true : false )
  const { user } = useUserContext()
  const router = useRouter()

  const handleChange = (val, key) => {
    let aux = { ...data, [key]: val }
    setData(aux)
  }

  const validar = (data) => {
    if (!data.nombre) {
      return 'El campo "Nombre y Apellido" es obligatorio.'
    }

    if (!data.username) {
      return 'El campo "Usuario" es obligatorio.'
    }

    if (!data.password) {
      return 'El campo "Contraseña" es obligatorio.'
    }

    if (!data.rol) {
      return 'El campo "Rol" es obligatorio.'
    }

    return true
  }

  const crear = async () => {
    setAccion({
      text: 'Creando Usuario...',
      value: true
    })
    try {
      let dataToSend = {
        ...data,
        rol: data.rol.value.toLocaleLowerCase()
      }
      let validate = validar(dataToSend)
      if(validate !== true)
      {
        setError({
          value: true,
          mensaje: validate
        })
        setAccion({
          text: '',
          value: false
        })
        return
      }

      const response = await fetch(`${process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL }/usuarios`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer "+ user.token,
          },
          body: JSON.stringify(dataToSend)
        }
      )

      const json = await response.json();
      if(json.status === 'SUCCESS')
        router.push("/usuario");
      else
        setError({
          value: true,
          mensaje: json.message
        })
    } catch (error) {
      console.log(error)
      setError({
        value: true,
        mensaje: 'Ocurrio un error, vuelva a intentar luego.'
      })
    }
    setAccion({
      text: '',
      value: false
    })
  }

  useEffect(() => {
    const buscarUsuario = async (id) => {
        setLoading(true)
        try {
          const response = await fetch(`${process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL }/usuarios/${id}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + user.token,
              },
            }
          );
          const json = await response.json();
          console.log(json);
          if(json.status === 'SUCCESS')
          {
            setData({ 
              ...json.data,
              rol: json.data.rol === 'admin' ? 'Administrador' : 'Secretaria' 
            })
            setLoading(false)
          }
          else
            router.push("/usuario");
      } catch (error) {
        router.push("/usuario");
        console.log(error);
      }
      setLoading(false)
    }
    if(params.id !== null)
    {
        buscarUsuario(params.id)
    }
}, [params.id])

  return (
      <div className='u-1/1 u-flex-center-center u-p2--vertical u-p5--horizontal'>
        <ProtectedPath permisos={["administrar_usuarios"]}/>
        <div className='u-absolute--top_right u-zindex--higher'>
          <Button text={'Volver'} url={'/usuario'}/>
        </div>
        <div className='c-nuevo_paciente'>
            <h2 className='u-color--primary'>{ params.id  ? 'Editar' : 'Nuevo'} Usuario</h2>
            {
                !loading ?
                    <>
                        <div className='c-nuevo_paciente__item'>
                            <div>
                                <span>Nombre y Apellido</span>
                                <Input defaultValue={data.nombre} handleChange={(val) => handleChange(val, 'nombre')}/>
                            </div>
                        </div>
                        <div className='c-nuevo_paciente__item'>
                            <div>
                                <span>Rol</span>
                                {
                                  !params.id ?
                                    <Select 
                                        options={[ { id:1, value: 'Secretaria' }, { id:2, value: 'Administrador' } ]} 
                                        handleChange={(val) => handleChange(val, 'rol')}
                                        defaultOption={data.rol}
                                    />
                                  :
                                    <Input defaultValue={data.rol} isReadOnly={true}/>
                                }
                            </div>
                        </div>
                        <div className='c-nuevo_paciente__item'>
                            <div>
                                <span>Telefono</span>
                                <Input defaultValue={data.telefono} handleChange={(val) => handleChange(val, 'telefono')}/>
                            </div>
                        </div>
                        <div className='c-nuevo_paciente__item'>
                            <div>
                                <span>Email</span>
                                <Input defaultValue={data.mail} handleChange={(val) => handleChange(val, 'mail')}/>
                            </div>
                        </div>
                        <div className='c-nuevo_paciente__item'>
                            <div>
                                <span>Usuario</span>
                                <Input defaultValue={data.username} handleChange={(val) => handleChange(val, 'username')}/>
                            </div>
                        </div>
                        <div className='c-nuevo_paciente__item'>
                            <div className={'u-1/1 u-flex-column-center-start'}>
                                <span>Contraseña</span>
                                <Input className={'u-1/1'} type={'password'} defaultValue={data.password} handleChange={(val) => handleChange(val, 'password')}/>
                            </div>
                        </div>
                    </>
                :
                    <></>
            }
            {
                error.value &&
                <div className='c-nuevo_paciente__item c-nuevo_paciente__item--right'>
                    <p className='u-text--1 u-color--red'>{error.mensaje}</p>
                </div>
            }
            {
                loading || accion.value ?
                    <div className='c-nuevo_paciente__item c-nuevo_paciente__item--right u-p3--vertical'>
                        <Loader text={accion.text.length > 0 ? accion.text : 'Cargando paciente...'}/>
                    </div>
                :
                    !loading?
                        <div className='c-nuevo_paciente__item c-nuevo_paciente__item--right u-m4--top'>
                            <Button text={ params.id ? 'Editar' : 'Crear' + ' Usuario' } clickHandler={ params.id ? () => editar() : () => crear() }/>
                        </div>
                    :
                        <></>
            }
        </div>
      </div>
  )
}

export default page