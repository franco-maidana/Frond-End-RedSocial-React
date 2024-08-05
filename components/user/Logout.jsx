import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Logout = () => {

  const {setAuth, setCounters} = useAuth()
  const navigate = useNavigate()

  useEffect(()=>{
    // Vaciar el localStorage
    localStorage.clear()
    // Setear estados globales a vacio
    setAuth({});
    setCounters({});
    // Navegar (redireccion ) al login
    navigate('/login')
  })

  return (
    <h1>Cerrando Session... </h1>
  )
}

export default Logout
