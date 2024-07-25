"use client";
// Next React
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Components
import Table from "@/components_UI/Table";
import ContextMenu from "@/components_UI/ContextMenu";
import Overlay from "@/components_UI/Overlay";
import PopUp from "@/components_UI/PopUp";
import Button from "@/components_UI/Button";

// Context
import { useUserContext } from "@/contexts/user";

// Icons
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Loader from "@/components_UI/Loader";
import { checkFetch } from "@/utils/checkFetch";

const headers = [
  {
    id: "dni",
    text: "DNI",
  },
  {
    id: "nombre",
    text: "Nombres",
  },
  {
    id: "apellido",
    text: "Apellidos",
  },
  {
    id: "genero",
    text: "Genero",
  },
  {
    id: "obraSocial",
    text: "Obra Social",
  },
  {
    id: "obraSocialNum",
    text: "Numero Obra Social",
  },
  {
    id: "telefono1",
    text: "Telefono 1",
  },
  {
    id: "telefono2",
    text: "Telefono 2",
  },
  {
    id: "email",
    text: "Email",
  },
];

const TableAux = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [contextMenu, setContextMenu] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState({
    value: false,
    message: ''
  })
  const { user, logOut } = useUserContext();
  const router = useRouter();

  const getPacientes = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL }/pacientes`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + user?.token,
          },
        }
      );
      const json = await response.json();
      checkFetch(json, logOut)
      if(json.status === 'SUCCESS')
      {
        if(json.data.length)
        {
          setData(json.data.map(el => { 
            let telefono1 = el.contactos.find( contacto => contacto.tipo === 'telefono' )?.valor
            let telefono2 = el.contactos.find( contacto => contacto.tipo === 'telefono' && contacto.valor !== telefono1)?.valor
            let email = el.contactos.find( contacto => contacto.tipo === 'email' )?.valor
            return({
              ...el,
              obraSocial: el.coberturas[0]?.nombre,
              obraSocialNum: el.coberturas[0]?.numero,
              telefono1: telefono1,
              telefono2: telefono2,
              email: email,
            })
          }))
        }
        else
          setData([])
        setLoading(false)
      } 
      setLoading(false)
    } catch (error) {
      console.log(error);
      //router.push("/");
    }
  }

  const deletePaciente = async (id) => {
    try {
      const response = await fetch(`${process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL }/pacientes/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer "+ user.token,
          }
        }
      )
      const json = await response.json();
      checkFetch(json, logOut)
      if(json.status === 'SUCCESS')
      {
        await getPacientes()
      }
      else
      {
        setError({
          value: true,
          message: json.message
        })
      }
      setDeleting(null)
    } catch (error) {
      router.push("/pacientes");
    }
  }

  useEffect(() => {
    getPacientes();
  }, [user]);
  
  return (
    <>
      {
       deleting &&
       <Overlay>
        <PopUp centered={true}>
          <p className='u-text--1 u-m3--bottom'>{`¿Esta seguro que desea eliminar al paciente "${`${deleting.apellido}, ${deleting.nombre}`}"?`}</p>
          <div className='u-1/1 u-flex-end-center'>
            <Button text={'Aceptar'} clickHandler={() => deletePaciente(deleting.id)}/>
            <Button text={'Rechazar'} clickHandler={() => setDeleting(null)}/>
          </div>
        </PopUp>
       </Overlay> 
      }
      {
       error.value &&
       <Overlay>
        <PopUp centered={true}>
          <p className='u-text--1 u-m3--bottom'>{error.message}</p>
          <div className='u-1/1 u-flex-end-center'>
            <Button text={'Aceptar'} clickHandler={() => setError({value: false, message: ''})}/>
          </div>
        </PopUp>
       </Overlay> 
      }
      {
        contextMenu && 
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          rowData={contextMenu.rowData}
          setContextMenu={setContextMenu}
        >
          <div className="c-context_menu--item" onClick={() => router.push(`/paciente/crear/${contextMenu?.rowData?.id}`)}>
            <FaRegEdit/>
            <span className="u-6/7">Editar</span>
          </div>
          <div className="c-context_menu--item" onClick={() => setDeleting(contextMenu?.rowData)}>
            <MdDeleteForever/>
            <span className="u-6/7">Eliminar</span>
          </div> 
        </ContextMenu>
      }
      {
        loading?
          <div className="u-1/1 u-flex-column-center-center">
            <Loader text="Cargando pacientes..."/>
          </div>
        :
          data && data.length > 0 ?
            <Table columns={headers} rows={data} setContextMenu={setContextMenu} contextMenu={contextMenu}/>
          :
            <div className="u-1/1 u-flex-column-center-center u-p4--vertical">
              <p>No hay informacion para mostrar</p>
            </div>
      }
    </>
  )
};

export default TableAux;
