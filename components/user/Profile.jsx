import React, { useEffect, useState } from "react";
import {Link, useParams} from 'react-router-dom'
import GetProfile from '../../helpers/GetProfile'
import Global from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
// import PublicationList from "../publication/PublicationList";
import avatar from '../../src/assets/img/user.png'
import ReactTimeAgo from 'react-time-ago';

const Profile = () => {

  const {Auth} = useAuth() // metodo de autenticacion
  const [user, setUser] = useState({}); // estados de usuario
  const [counter, setCounter] = useState({}) // estados de contadores seguidores/seguidos
  const params = useParams() // params.userID = a usuario logeado
  const [iFollow, setIFollow] = useState(false)
  const [publication, setPublication] = useState([]) // publicaciones del usuario
  const [page, setPage] = useState(1) // paginacion de las publicaciones
  const [more, setMore] = useState(true) // metodo para la eliminacion del boton del ver mas usuario

  console.log(params)

  useEffect(()=>{
    const getDataUser = async () => {
      let dataUsers = await GetProfile(params.userId , setUser);
      if(dataUsers.following && dataUsers.following._id) setIFollow(true)
    }
    
    getDataUser()
    getCounters()
    getPublication(1, true)
  }, [] )

  useEffect(()=>{
    const getDataUser = async () => {
      let dataUsers = await GetProfile(params.userId , setUser);
      if(dataUsers.following && dataUsers.following._id) setIFollow(true)
    }
    
    getDataUser()
    getCounters()
    setMore(true)
    getPublication(1, true )
  },[params]) // Siempre que hay un cambio de id me vuele a ejecutar todo lo demas 

  const getCounters = async() => {
    const request = await fetch(Global.url + "users/counters/" + params.userId , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      }
    })
    const data = await request.json();
    if(data.statusCode == 200){
      setCounter(data)
    }
  }

  const follow = async (userId) => {
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        'Authorization': localStorage.getItem('token')
      }
    });
    const data = await request.json();
    if (data.statusCode === 200) {
        setIFollow(true)
    }
  };

  const unFollow = async (userId) => {
    const request = await fetch(Global.url + "follow/delete/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': localStorage.getItem('token')
      }
    });
    const data = await request.json();
    if (data.statusCode === 200) {
      setIFollow(false)
    }
  }

  // Subir publicaciones 
  const getPublication = async (nextPage = 1, newProfile = false) => {
    const request = await fetch(Global.url + "publication/userPublication/" + params.userId + "/" + nextPage, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    })
    const data = await request.json()
    
    if(data.statusCode == 200){

      let newPublication =  data.publicaciones

      if(!newProfile && publication.length >= 1){
        newPublication = [...publication, ...data.publicaciones]
      }

      // se resetea todo el perfil cuando es nuevo
      if(newProfile){
        newPublication =  data.publicaciones
        setMore(true)
        setPage(1)
      }

      setPublication(newPublication)

      
      if(!newProfile && publication.length >= (data.totalPublication - data.publicaciones.length)){
          setMore(false)
      }

      // para eliminar el boton de ver mas publicaciones cuando la pagina tiene 5 publicaiones o menos
      if(data.pages <= 1){
        setMore(false)
      }
    }
  }

  const nextPage = async () => {
    const next = page + 1
    setPage(next)
    getPublication(next)
  }

  // Borrar una publicacion 
  const deletePublication = async (publicationId) => {
    // Peticion a la base de datos
    try {
      const request = await fetch(Global.url + "publication/remove/" + publicationId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      });
      const dataDelete = await request.json();
      console.log(dataDelete);
  
      setPage(1);
      setMore(true);
      getPublication(1, true);
    } catch (error) {
      console.error("Error deleting publication:", error);
    }
    };

return (
  <>
    <header className="aside__profile-info">
      <div className="profile-info__general-info">
        <div className="general-info__container-avatar">
          <img
            src={user.image && user.image !== "https://i.postimg.cc/wTgNFWhR/profile.png"
              ? `${Global.url}users/avatar/${user.image}`
              : "https://i.postimg.cc/wTgNFWhR/profile.png"}
            className="container-avatar__img"
            alt="Foto de perfil"
          />
        </div>

        <div className="general-info__container-names">
          <div href="#" className="container-names__name">
            <h1>{user.name}</h1>
            {/* renderiza un botón solo si user._id no es igual a Auth._id. */}
            {user._id !== Auth._id &&
              (iFollow ?
                <button onClick={() => unFollow(user._id)} className=" content__button--rigth post__button">Dejar de seguir</button>
                :
                <button onClick={() => follow(user._id)} className=" content__button--rigth post__button post__button--green">Seguir</button>
              )}
          </div>
          <h2 className="container-names__nickname">{user.nick}</h2>
        </div>
      </div>

      <div className="profile-info__stats">
        <div className="stats__following">
          <Link to={'/social/siguiendo/' + user._id} className="following__link">
            <span className="following__title">Siguiendo</span>
            <span className="following__number"> {counter.following >= 1 ? counter.following : 0} </span>
          </Link>
        </div>
        <div className="stats__following">
          <Link to={'/social/seguidores/' + user._id} className="following__link">
            <span className="following__title">Seguidores</span>
            <span className="following__number"> {counter.followed >= 1 ? counter.followed : 0} </span>
          </Link>
        </div>

        <div className="stats__following">
          <Link to={'/social/perfil/' + user._id} className="following__link">
            <span className="following__title">Publicaciones</span>
            <span className="following__number"> {counter.publication >= 1 ? counter.publication : 0} </span>
          </Link>
        </div>
      </div>
    </header>

    <div className="content__posts">
      {publication.map((res) => {
        return (
          <article className="posts__post" key={res._id}>
            <div className="post__container">
              <div className="post__image-user">
                <Link to={'/social/perfil/' + user._id} className="post__image-link">
                  <img
                    src={res.user.image && res.user.image !== "https://i.postimg.cc/wTgNFWhR/profile.png"
                      ? `${Global.url}users/avatar/${res.user.image}`
                      : "https://i.postimg.cc/wTgNFWhR/profile.png"}
                    className="container-avatar__img"
                    alt="Foto de perfil"
                  />
                </Link>
              </div>

              <div className="post__body">
                <div className="post__user-info">
                  <h1 className="user-info__name">{res.user.name}</h1>
                  <span className="user-info__divider"> | </span>
                  <a href="#" className="user-info__create-date"><ReactTimeAgo date={res.create_at} locale='es-ES'/></a>
                </div>

                <h4 className="post__content">{res.text}</h4>
                {res.file && <img src={Global.url + 'publication/media/' + res.file } />}
              </div>
            </div>

            {Auth._id === res.user._id &&
              <div className="post__buttons">
                <button onClick={() => deletePublication(res._id)} className="post__button">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            }
          </article>

        )
      })}
    </div>

    {more &&
      <div className="content__container-btn" onClick={nextPage}>
        <button className="content__btn-more-post"> Ver mas publicaciones </button>
      </div>
    }

    <br/>
  </>
);

};

export default Profile;
