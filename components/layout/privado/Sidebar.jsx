import React, { useState } from "react"; 
import avatar from '../../../src/assets/img/user.png';
import useAuth from "../../../hooks/useAuth";
import Global from "../../../helpers/Global";
import { Link, NavLink } from "react-router-dom";
import useForm from "../../../hooks/UseForm";

const Sidebar = () => {
  const { Auth, Counters } = useAuth();
  const { form, changed } = useForm();
  const [stored, setStored] = useState("not_stored");

  // Guardar publicaciones
  const savePublication = async (e) => {
    e.preventDefault();
  
    const newPublication = form;
    newPublication.user = Auth._id;
  
    try {
      // Guardar la publicación
      const request = await fetch(Global.url + "publication/save", {
        method: "POST",
        body: JSON.stringify(newPublication),
        headers: {
          "Content-Type": 'application/json',
          'Authorization': localStorage.getItem("token")
        }
      });
  
      const data = await request.json();
      console.log('Publication save response:', data);
      if (data.statusCode === 200) {
        setStored('stored');
        // Subir la imagen dentro de la condicion de subir la publicacion
        const fileInput = document.querySelector("#file");
        if (fileInput.files[0] && data.publicacion && data.publicacion._id) {
          const formData = new FormData();
          formData.append("file0", fileInput.files[0]);
  
          const uploadRequest = await fetch(Global.url + 'publication/upload/' + data.publicacion._id, {
            method: "POST",
            body: formData,
            headers: {
              'Authorization': localStorage.getItem("token")
            }
          });
  
          const uploadData = await uploadRequest.json();
  
          if (uploadData.statusCode === 200) {
            setStored('stored');
            
          } else {
            console.error('Error al subir la imagen:', uploadData);
            setStored('error');
          }
        }
        const myForm = document.querySelector("#publication-form"); 
        myForm.reset();
      } else {
        setStored('error');
      }
    } catch (error) {
      console.error("Error guardando la publicación:", error);
      setStored('error');
    }
  };
  
  

  return (
    <aside className="layout__aside">
      <header className="aside__header">
        <h1 className="aside__title">Hola, {Auth.name}</h1>
      </header>

      <div className="aside__container">
        <div className="aside__profile-info">
          <div className="profile-info__general-info">
            <div className="general-info__container-avatar">
              <img
                src={Auth.image && Auth.image !== "https://i.postimg.cc/wTgNFWhR/profile.png"
                      ? `${Global.url}users/avatar/${Auth.image}`
                      : avatar}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            </div>

            <div className="general-info__container-names">
              <NavLink to={'/social/perfil/'+ Auth._id} className="container-names__name">{Auth.name}</NavLink>
              <p className="container-names__nickname">{Auth.nick}</p>
            </div>
          </div>

          <div className="profile-info__stats">
            <div className="stats__following">
              <Link to={"siguiendo/" + Auth._id} className="following__link">
                <span className="following__title">Siguiendo</span>
                <span className="following__number">{Counters.following}</span>
              </Link>
            </div>
            <div className="stats__following">
              <Link to={"seguidores/" + Auth._id} className="following__link">
                <span className="following__title">Seguidores</span>
                <span className="following__number">{Counters.followed}</span>
              </Link>
            </div>

            <div className="stats__following">
                <NavLink to={'/social/perfil/'+ Auth._id} className="following__link">
                <span className="following__title">Publicaciones</span>
                <span className="following__number">{Counters.publication}</span>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="aside__container-form">
          {stored === "stored" && (
            <strong className="alert alert-success">
              Publicación Guardada Correctamente!!
            </strong>
          )}
          {stored === "error" && (
            <strong className="alert alert-danger">
              Error En Guardar La Publicación!!
            </strong>
          )}
          <form id="publication-form" className="container-form__form-post" onSubmit={savePublication}>
            <div className="form-post__inputs">
              <label htmlFor="text" className="form-post__label"> ¿Qué estás pensando hoy? </label>
              <textarea name="text" className="form-post__textarea" onChange={changed} />
            </div>

            <div className="form-post__inputs">
              <label htmlFor="file" className="form-post__label"> Sube tu foto </label>
              <input type="file" name="file0" id="file" className="form-post__image" />
            </div>

            <input type="submit" value="Enviar" className="form-post__btn-submit" />
          </form>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
