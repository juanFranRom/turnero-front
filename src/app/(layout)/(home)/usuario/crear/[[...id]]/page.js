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
import Overlay from '@/components_UI/Overlay'
import PopUp from '@/components_UI/PopUp'
import { checkFetch } from '@/utils/checkFetch'

const page = ({ params }) => {
  const [data, setData] = useState({
    username: '',
    nombre: '',
    clinica: '',
    telefono: '',
    mail: '',
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
  const [modificandoPass, setModificandoPass] = useState( false )
  const { user, logOut } = useUserContext()
  const router = useRouter()

  const handleChange = (val, key) => {
    let aux = { ...data, [key]: val }
    setData(aux)
  }

  const validar = (data, crear = true) => {
    if (!data.nombre) {
      return 'El campo "Nombre y Apellido" es obligatorio.'
    }

    if (!data.username) {
      return 'El campo "Usuario" es obligatorio.'
    }

    if (!data.password && crear) {
      return 'El campo "Contraseña" es obligatorio.'
    }

    if (!data.rol) {
      return 'El campo "Rol" es obligatorio.'
    }

    return true
  }

  const editar = async () => {
    setModificandoPass( false )
    setAccion({
      text: 'Editando Usuario...',
      value: true
    })
    try {
      let dataToSend = {
        ...data,
      }

      if(typeof data.rol !== "string")
        dataToSend.rol = data.rol.value.toLocaleLowerCase();
      else
        dataToSend.rol = dataToSend.rol.toLocaleLowerCase(); 

      let validate = validar(dataToSend, false)
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

      //Puede no querer cambiar la pass
      if(dataToSend.password && dataToSend.password.trim() === ""){
        delete dataToSend.password
      }

      const response = await fetch(`${process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL }/usuarios/${params.id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer "+ user.token,
          },
          body: JSON.stringify(dataToSend)
        }
      )
      const json = await response.json();
      checkFetch(json, logOut)
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
      checkFetch(json, logOut)
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
          checkFetch(json, logOut)
          if(json.status === 'SUCCESS')
          {
            setData({ 
              ...json.data,
              rol: json.data.rol === 'administrador' ? 'Administrador' : json.data.rol === 'profesional'?'Profesional': 'Secretaria' 
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
    if(params.id)
    {
        buscarUsuario(params.id)
    }
}, [params.id])

  return (
      <div className='u-1/1 u-flex-center-center u-p2--vertical u-p5--horizontal'>
        {
          modificandoPass && 
          <Overlay>
            <PopUp centered={true}>
              <div className='u-1/1 u-flex-column-center-center u-p2--vertical u-p5--horizontal'>
                <p>Estas modificando la contraseña del usuario.</p>
                <p className='u-m3--bottom'>¿Seguro que quieres continuar?</p>
                <div className='u-1/1 u-flex-center-end'>
                  <Button text={'Aceptar'} clickHandler={editar}/>
                  <Button text={'Cancelar'} clickHandler={() => setModificandoPass( false )}/>
                </div>
              </div>
            </PopUp>
          </Overlay>
        }
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
                                        options={data.rol!== "Profesional"?[ { id:1, value: 'Secretaria' }, { id:2, value: 'Administrador' } ]:[ { id:3, value: 'Profesional' } ]} 
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
                        <Loader text={accion.text.length > 0 ? accion.text : 'Cargando usuario...'}/>
                    </div>
                :
                    !loading?
                        <div className='c-nuevo_paciente__item c-nuevo_paciente__item--right u-m4--top'>
                            <Button 
                              text={ params.id ? 'Editar' : 'Crear' + ' Usuario' } 
                              clickHandler={ params.id ? () => data.password && data.password.trim() !== "" ? setModificandoPass(true) : editar() : () => crear() }
                            />
                        </div>
                    :
                        <></>
            }
        </div>
      </div>
  )
}

export default page