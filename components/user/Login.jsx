import { useState } from 'react';
import useForm from '../../hooks/UseForm';
import Global from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState('not_sended');
  const { setAuth } = useAuth();

  const loginUser = async (e) => {
    e.preventDefault(); // para que no se me actualize la pantalla

    // Datos del formulario
    const userToLogin = form;

    // Petición al backend
    const opciones = {
      method: 'POST',
      body: JSON.stringify(userToLogin),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const request = await fetch(`${Global.url}users/login`, opciones);
      console.log(Global.url + "users/login");

      if (!request.ok) {
        throw new Error(`HTTP error! status: ${request.status}`);
      }

      const data = await request.json();

      if (data.statusCode === 200) {
        // Persistir los datos en el navegador
        localStorage.setItem('token', data.token); // Guardamos datos en el localStorage
        localStorage.setItem('user', JSON.stringify(data.user)); // Guardamos datos en el localStorage
        setSaved('login');
        // Setear datos en el auth
        setAuth(data.user);
        // Redireccion al privado
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setSaved('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSaved('error');
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Login</h1>
      </header>

      {saved === 'login' ? (
        <strong className="alert alert-success">Usuario Identificado Correctamente!!</strong>
      ) : (
        ' '
      )}
      {saved === 'error' ? (
        <strong className="alert alert-danger">El usuario no se Identifico Correctamente</strong>
      ) : (
        ' '
      )}

      <div className="content__posts">
        <form className="form-login" onSubmit={loginUser}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" onChange={changed} />
          </div>

          <input type="submit" value="identificate" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};

export default Login;
