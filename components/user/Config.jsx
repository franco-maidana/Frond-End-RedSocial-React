import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Global from "../../helpers/Global";
import serializeForm from "../../helpers/SerializeFrom";
import avatar from '../../src/assets/img/user.png'

const Config = () => {
  const { Auth, setAuth } = useAuth();
  const [saved, setSaved] = useState("not_saved");

  const updateUser = async (e) => {
    e.preventDefault();

    // agarramos datos del formulario
    const formData = serializeForm(e.target);
    delete formData.file0; // Eliminamos datos que no nos sirven 

    // Crear un nuevo objeto solo con los campos modificados
    const newDataUser = {};
    for (const key in formData) {
      if (formData[key] && formData[key] !== Auth[key]) {
        newDataUser[key] = formData[key];
      }
    }

    // Si no hay cambios, no hacemos la solicitud
    if (Object.keys(newDataUser).length === 0) {
      setSaved("not_saved");
      return;
    }

    // actualizar usuarios en la base de datos 
    const opciones = {
      method: "PUT",
      body: JSON.stringify(newDataUser),
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    };

    try {
      const request = await fetch(Global.url + "users/update", opciones);
      const data = await request.json();

      if (data.statusCode === 200) {
        delete data.user.password;

        setAuth(data.user);
        setSaved("saved");
        console.log(Auth);
      } else {
        setSaved("error");
      }
    } catch (error) {
      setSaved("error");
      console.error("Error updating user:", error);
    }
  };

  const uploadImage = async (e) => {
    e.preventDefault();

    const fileInput = document.querySelector("#file");

    if (fileInput.files[0]) {
      const imageData = new FormData();
      imageData.append('file0', fileInput.files[0]); // agarrar imagen a subir

      try {
        const uploadRequest = await fetch(Global.url + "users/upload", {
          method: "POST",
          body: imageData,
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        });
        const uploadData = await uploadRequest.json();
        console.log(uploadData);

        if (uploadData.statusCode === 200) {
          setAuth(uploadData.user);
          setSaved("saved");
        } else {
          setSaved("error");
        }
      } catch (error) {
        setSaved("error");
        console.error("Error uploading image:", error);
      }
    } else {
      setSaved("not_saved");
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Ajustes</h1>
      </header>

      <div className="content__posts">
        {saved === "saved" && (
          <strong className="alert alert-success">
            Usuario Actualizado Correctamente!!
          </strong>
        )}
        {saved === "error" && (
          <strong className="alert alert-danger">
            Error en la Actualizacion del usuario!!
          </strong>
        )}
        <form className="config-form" onSubmit={updateUser}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" name="name" defaultValue={Auth.name} />
          </div>
          <div className="form-group">
            <label htmlFor="nick">Nick</label>
            <input type="text" name="nick" defaultValue={Auth.nick} />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Biografia</label>
            <textarea name="bio" defaultValue={Auth.biografia} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" name="email" defaultValue={Auth.email} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" />
          </div>
          <br/>
          <input type="submit" value="Actualizar" className="btn btn-success" />
        </form>

        <form className="config-form" onSubmit={uploadImage}>
          <div className="form-group">
            <label htmlFor="file01">Avatar</label>
            <div className="avatar">
              {/* Mostrar imagen */}
              <div className="general-info__container-avatar">
                <img src={Auth.image && Auth.image !== "https://i.postimg.cc/wTgNFWhR/profile.png" ? 
                  `${Global.url}users/avatar/${Auth.image}` : 
                  avatar} className="container-avatar__img" 
                  alt="Foto de perfil" />
              </div>
            </div>
            <br/>
            <input type="file" name="file0" id="file" />
          </div>
          <br/>
          <input type="submit" value="Subir Imagen" className="btn btn-success" />
        </form>
        <br/>
      </div>
    </>
  );
};

export default Config;
