import React, { useEffect, useState } from "react";
import {Link, useParams} from 'react-router-dom'
import Global from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import PublicationList from "./PublicationList";

const Feed = () => {

  const {Auth} = useAuth() // metodo de autenticacion
  const params = useParams() // params.userID = a usuario logeado
  const [user, setUser] = useState({}); // estados de usuario
  const [publication, setPublication] = useState([]) // publicaciones del usuario
  const [page, setPage] = useState(1) // paginacion de las publicaciones
  const [more, setMore] = useState(true) // metodo para la eliminacion del boton del ver mas usuario

  useEffect(()=>{
    
    getPublication(1, false)
  }, [] )

  // Subir publicaciones 
  const getPublication = async (nextPage = 1, showNews = false) => {

    if(showNews){
      setPublication([])
      setPage(1)
      nextPage = 1
    }


    const request = await fetch(Global.url + "publication/feed/"  + nextPage, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    })

    const data = await request.json()
    
    if(data.statusCode == 200){

      let newPublication =  data.user.publicaciones

      if(!showNews && publication.length >= 1){
        newPublication = [...publication, ...data.user.publicaciones]
      }

      setPublication(newPublication)

      // Cuando terminemos de ver las publicaciones la siguiente condicion para esconder el boton de ver mas publicaciones
      if(!showNews && publication.length >= (data.total - data.user.publicaciones.length)){
          setMore(false)
      }

      // para eliminar el boton de ver mas publicaciones cuando la pagina tiene 5 publicaiones o menos
      if(data.pages <= 1){
        setMore(false)
      }
    }
  }


  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button className="content__button" onClick={() => getPublication(1, true)}>Mostrar nuevas</button>
      </header>

      <PublicationList 
        publication={publication}
        getPublication={getPublication}
        page={page}
        user={user}
        setPage={setPage}
        more={more}
        setMore={setMore}
    />

    <br/>

    </>
  );
};

export default Feed;
