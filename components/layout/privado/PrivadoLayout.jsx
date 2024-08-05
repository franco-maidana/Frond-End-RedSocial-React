import React from 'react'
import Header from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import useAuth from '../../../hooks/useAuth'

const PrivadoLayout = () => {

  const {Auth, loading} = useAuth()

  if(loading){
    return <h1>Cargando...</h1>
  } else{
    return (
      <>
        {/* LAYOUT */}
        {/* cabecera y navegacion */}
        <Header/> 
        {/* CONTENIDO PRINCIPAL */}
        <section className='layout__content'>
          {Auth._id ?
          <Outlet/>
          :
          <Navigate to='/login'/>
        }
        </section>
        {/* barra lateral */}
        <Sidebar/>
      </>
    )
  }
  
}

export default PrivadoLayout
