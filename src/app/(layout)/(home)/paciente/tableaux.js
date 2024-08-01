"use client";
// Next React
import { useState, useEffect, useRef } from "react";
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
import Input from "@/components_UI/Input";

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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true)
  const [contextMenu, setContextMenu] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState({
    value: false,
    message: ''
  })
  const [paginado, setPaginado] = useState({
    totalPages: 1,
    page: 0,
    pageSize: 5,
    filtro: ''
  })
  const { user, logOut } = useUserContext();
  const debounceTimeout = useRef(null)
  const router = useRouter();

  const getPacientes = async () => {
    setLoading(true)
    const generarFiltro = ( ) => {
      let result = ''

      if(paginado.filtro)
        result += `searchValue=${paginado.filtro}&`

      result += `page=${paginado.page}&`
      result += `pageSize=${paginado.pageSize}`

      return result
    }
    try {
      const response = await fetch(`${process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL }/pacientes/search?${generarFiltro()}`,
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
        if(json.data.pacientes.length)
        {
          setData(json.data.pacientes.map(el => { 
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
          setPaginado( { ...paginado, totalPages: json.data.totalPages })
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
        await getPacientes()
      else
        setError({
          value: true,
          message: json.message
        })
      setDeleting(null)
    } catch (error) {
      router.push("/pacientes");
    }
  }

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      getPacientes();
    }, 100);
    
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    }
  }, [user, paginado.page, paginado.pageSize, paginado.filtro]);
  
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
          data !== null ?
            <Table columns={headers} rows={data} setContextMenu={setContextMenu} contextMenu={contextMenu} loading={loading} filtroPlaceholder={'Filtro (Nombre, Apellido, DNI)'} filtro={paginado.filtro} setFiltro={(val) => setPaginado(prev => ({ ...prev, filtro: val }))} totalPages={paginado.totalPages} realPage={paginado.page} changePage={(val) => setPaginado(prev => ({ ...prev, page: val }))} realSize={paginado.pageSize} changeSize={(val) => setPaginado(prev => ({ ...prev, pageSize: val }))}/>
          :
            <div className="u-1/1 u-p5">
              <Loader text="Cargando pacientes..."/>
            </div>
      }
    </>
  )
};

export default TableAux;
