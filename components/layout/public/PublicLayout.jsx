import React from 'react'
import Header from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'

const PublicLayout = () => {

  const {Auth} = useAuth()

  return (
    <>
      {/* LAYOUT */}
      <Header/> 
      {/* CONTENIDO PRINCIPAL */}
      <section className='layout__content'>
        {!Auth._id ? 
        <Outlet/>
        :
        <Navigate to='/social' />
      }
      </section>
    </>
  )
}

export default PublicLayout
