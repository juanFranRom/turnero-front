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
    text: "Apellido",
  },
  {
    id: "genero",
    text: "Genero",
  },
  {
    id: "obrasSocialesCant",
    text: "Obras Sociales",
  },
  {
    id: "practicasCant",
    text: "Practicas",
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
  const [loading, setLoading] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState({
    value: false,
    message: ''
  })
  const { user } = useUserContext();
  const router = useRouter();

  const getProfesionales = async () => {
    setLoading(true)
    try {
      console.log("llego")
      const response = await fetch(`${process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL }/profesionales`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            //authorization: "Bearer " + user.token,
          },
        }
      );
      const json = await response.json();
      console.log(json)
      if(json.status === 'SUCCESS')
      {
        if(json.data.length)
          setData(json.data)
        else
          setData([])
        setLoading(false)
      }
      else
        //router.push("/")
      setLoading(false)
    } catch (error) {
      console.log(error);
      //router.push("/");
    } 
  }

  useEffect(() => {
    getProfesionales();
  }, []);
  
  return (
    <>
      {
       /*deleting &&
       <Overlay>
        <PopUp centered={true}>
          <p className='u-text--1 u-m3--bottom'>{`¿Esta seguro que desea eliminar el proveedor "${deleting.razon_social ? deleting.razon_social : `${deleting.apellido}, ${deleting.nombre}`}"?`}</p>
          <div className='u-1/1 u-flex-end-center'>
            <Button text={'Aceptar'} clickHandler={() => deleteProveedor(deleting.cuit)}/>
            <Button text={'Rechazar'} clickHandler={() => setDeleting(null)}/>
          </div>
        </PopUp>
       </Overlay> */
      }
      {
       /*error.value &&
       <Overlay>
        <PopUp centered={true}>
          <p className='u-text--1 u-m3--bottom'>{error.message}</p>
          <div className='u-1/1 u-flex-end-center'>
            <Button text={'Aceptar'} clickHandler={() => setError({value: false, message: ''})}/>
          </div>
        </PopUp>
       </Overlay> */
      }
      {
        contextMenu && 
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          rowData={contextMenu.rowData}
          setContextMenu={setContextMenu}
        >
          <div className="c-context_menu--item" onClick={() => router.push(`/profesional/crear/${contextMenu?.rowData?.cuit}`)}>
            <FaRegEdit/>
            <span className="u-6/7">Editar</span>
          </div>
          {/*<div className="c-context_menu--item" onClick={() => setDeleting(contextMenu?.rowData)}>
            <MdDeleteForever/>
            <span className="u-6/7">Eliminar</span>
          </div>
          <div className="c-context_menu--item">
            <MdOutlinePaid/>
            <span className="u-6/7">Obtener ultima cuota</span>
          </div>*/}
        </ContextMenu>
      }
      {
        loading?
          <div className="u-1/1 u-flex-column-center-center">
            <Loader text="Cargando profesionales..."/>
          </div>
        :
          data && data.length > 0 ?
            <>
              <h1>Profesionales</h1>
              <Table columns={headers} rows={data} contextMenu={setContextMenu}/>
            </>
          :
            <div className="u-1/1 u-flex-column-center-center u-p4--vertical">
              <p>No hay informacion para mostrar</p>
            </div>
      }
    </>
  )
};

export default TableAux;
