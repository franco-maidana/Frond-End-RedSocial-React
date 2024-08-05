import React, { useState } from 'react';
import useForm from '../../hooks/UseForm';
import Global from '../../helpers/Global';

const Register = () => {
  const { form, changed } = useForm({});
  const [saved , setSaved] = useState("not_sended")
  const [error , setError] = useState([]) // mensaje del error al crear el usuario tanto como el email como el nick

  const saveUser = async (e) => {
    // Prevenir actualizacion de pantalla
    e.preventDefault()
    // agarrando datos del formulario
    let newUser = form

    const opciones = {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json"
      }
    }

    // Guardando datos en el backend
    const request = await fetch(Global.url + "users/register" , opciones) // URL del backend
    const data =  await request.json()

    if(data.statusCode == 200){
      setSaved('saved')
    }else{
      setSaved("error")
      setError(data.message)
    }
  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Registro</h1>
      </header>

    {saved == 'saved' ?
    <strong className='alert alert-success'> Usuario Registrado Correctamente!! </strong> 
    : " "}
    {saved == 'error' ?
    <strong className='alert alert-danger'> Error en la creacion del usuario!! <br></br> {error} </strong>
    : " "}

      <div className="content__posts">
        <form className="register-form" onSubmit={saveUser}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" name="name" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="nick">Nick</label>
            <input type="text" name="nick" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" name="email" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" onChange={changed} />
          </div>

          <input type="submit" value="Regístrate" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};

export default Register;
