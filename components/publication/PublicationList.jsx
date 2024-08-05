import React from 'react'
import Global from '../../helpers/Global'
import { useEffect, useState } from "react";
import {Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth';
import ReactTimeAgo from 'react-time-ago';

const PublicationList = ({publication, getPublication, page, setPage, more, setMore }) => {

  const {Auth} = useAuth()


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
    <div className="content__posts">
      {publication.map((res) => {
        return (
          <article className="posts__post" key={res._id}>
            <div className="post__container">
              <div className="post__image-user">
                <Link to={'/social/perfil/' + res.user._id} className="post__image-link">
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

  </>
  )
}

export default PublicationList
