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
    id: "username",
    text: "Usuario",
  },
  {
    id: "nombre",
    text: "Nombre",
  },
  {
    id: "sucursal",
    text: "Clinica",
  },
  {
    id: "telefono",
    text: "Telefono",
  },
  {
    id: "mail",
    text: "Email",
  },
  {
    id: "rol",
    text: "Rol",
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

  const getData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL }/usuarios`,
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
            return({
              ...el,
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

  const deleteData = async (id) => {
    try {
      const response = await fetch(`${process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL }/usuarios/${id}`,
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
        await getData()
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
      router.push("/usuario");
    }
  }

  useEffect(() => {
    getData();
  }, [user]);
  
  return (
    <>
      {
       deleting &&
       <Overlay>
        <PopUp centered={true}>
          <p className='u-text--1 u-m3--bottom'>{`¿Esta seguro que desea eliminar al usuario "${`${deleting.nombre}`}"?`}</p>
          <div className='u-1/1 u-flex-end-center'>
            <Button text={'Aceptar'} clickHandler={() => deleteData(deleting.id)}/>
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
          <div className="c-context_menu--item" onClick={() => router.push(`/usuario/crear/${contextMenu?.rowData?.id}`)}>
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
            <Loader text="Cargando usuarios..."/>
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
