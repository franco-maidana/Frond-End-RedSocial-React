import { createContext, useState, useEffect } from 'react'
import Global from '../helpers/Global'

export const AuthContext = createContext()

const AuthProvider = ({children}) => {
  const [Auth , setAuth] = useState({})
  const [Counters , setCounters] = useState({})
  const [loading, setLoading] = useState(true)
  

  useEffect(()=>{
    AuthUser()
  },[])

  const AuthUser = async() => {
    // Sacar datos identificafo del localStorage
    const token = localStorage.getItem("token")
    const user = localStorage.getItem('user')
    // Comprobar si tengo el token y el user
    if(!token || !user){
      setLoading(false)
      return false
    }
    // transformar los datos a un objeto de js
    const userObj = JSON.parse(user)
    const userId = userObj.id
    // Peticion ajax al backend que compruebe el token y que me devuelva todos los datos del usuario
    const opciones = {
      method: "GET",
      headers: {
        "Content-Type": 'application/json',
        "Authorization": token
      } 
    }
    const request = await fetch(Global.url + "users/profile/" + userId , opciones)
    const data = await request.json()

    // Peticion para los contadores
    const opcionesContadores = {
      method: "GET",
      headers: {
        "Content-Type": 'application/json',
        "Authorization": token
      } 
    }
    const requestContadores = await fetch(Global.url + "users/counters/" + userId , opcionesContadores)
    const dataContadores = await requestContadores.json()

    //setear el estado de auth

    setAuth(data.user)
    setCounters(dataContadores) 
    setLoading(false)
  }


  return (
    <AuthContext.Provider
      value={{
        Auth,
        setAuth,
        Counters,
        setCounters,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
