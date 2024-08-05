import React from 'react'
import {Route , Routes , BrowserRouter, Navigate} from 'react-router-dom'
import PublicLayout from '../components/layout/public/PublicLayout'
import Login from '../components/user/Login'
import Register from '../components/user/Register'
import PrivadoLayout from '../components/layout/privado/PrivadoLayout'
import Feed from '../components/publication/Feed'
import AuthProvider from '../context/AuthProvider'
import Logout from '../components/user/Logout'
import People from '../components/user/People'
import Config from '../components/user/Config'
import Following from '../components/follow/Following'
import Followers from '../components/follow/Followers'
import Profile from '../components/user/Profile'

const Rutas = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas Publicas */}
          <Route path='/' element={<PublicLayout/>} >
            <Route index element={<Login/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/registro' element={<Register/>}/>
          </Route>
          {/* Rutas privadas */}
          <Route path='/social' element={<PrivadoLayout/>}>
            <Route index element={<Feed/>} />
            <Route path='feed' element={<Feed/>} />
            <Route path='logout' element={<Logout/>}/>
            <Route path='people' element={<People/>}/>
            <Route path='ajustes' element={<Config/>}/>
            <Route path='siguiendo/:userId' element={<Following/>}/>
            <Route path='seguidores/:userId' element={<Followers/>}/>
            <Route path='perfil/:userId' element={<Profile/>}/>
          </Route>
          {/* Error 404 */}
          <Route path='*' element={<h1>Error 404</h1> }/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default Rutas
