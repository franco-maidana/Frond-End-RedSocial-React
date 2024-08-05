import React, { useEffect, useState } from "react";
import Global from "../../helpers/Global";
import { Link, useParams } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import GetProfile from "../../helpers/GetProfile";

const Followers = () => {
  const { Auth } = useAuth();
  const [user, setUser] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]); // usuarios que me siguen
  const [following, setFollowing] = useState([]) // usuarios que sigo
  const [profile, setProfile] = useState({}) // helpers

  const params = useParams()

  useEffect(() => {
    getUsers(page);
    GetProfile(params.userId, setProfile)
  }, [page]);

  const getUsers = async (nextPage) => {
    setLoading(true);

    // Sacar userId de la url
    const userId = params.userId

    const request = await fetch(Global.url + "follow/seguidores/"+ userId + '/' + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    let cleanUsers = []
    data.follows.forEach(follow => {
      cleanUsers = [...cleanUsers, follow.user  ]
    })
    data.users = cleanUsers // muestra los 5 usuarios y cuadno das a ver mas usuarios muestras los otros usuarios
    if (data.follows && data.statusCode === 200) {
      let newUser = data.follows;
      if (user.length >= 1) {
        newUser = [...user, ...data.follows];
      }

      setUser(newUser); // son los usuarios limite que pone el backend para ver en pantalla 
      setFollowers(data.usuariosFollowIds.followers); // aca esta los seguidores que me siguen 
      setFollowing(data.usuariosFollowIds.following); // usuarios que sigo
      console.log('usuarios que sigo', data.usuariosFollowIds.following)
      console.log('usuarios que  me siguen', data.usuariosFollowIds.followers)
      setLoading(false); // false

      // paginacion
      if (user.length >= (data.usuariosFollowIds.followers - data.users.length)) {
        setMore(false);
      }

    }
  };

  const nextPage = () => {
    setPage(page + 1);
    console.log(followers)
  };

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
      setFollowers([...followers, userId]);
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
      let filtered = followers.filter((followingUserId) => userId !== followingUserId);
      setFollowers(filtered);
    }
  };


  if (!user || !Auth) {
    return <div>Cargando...</div>;
  }
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Seguidores De {profile.name}</h1>
      </header>
      <div className="content__posts">
        {user.map((res) => (
          <article className="posts__post" key={res._id}>
            <div className="post__container">
              <div className="post__image-user">
                <Link to="#" className="post__image-link">
                  <img
                    src={
                      res.user.image &&
                      res.user.image !== "https://i.postimg.cc/wTgNFWhR/profile.png"
                        ? `${Global.url}users/avatar/${res.user.image}`
                        : "https://i.postimg.cc/wTgNFWhR/profile.png"
                    }
                    className="post__user-image"
                    alt="Foto de perfil"
                  />
                </Link>
              </div>
              <div className="post__body">
                <div className="post__user-info">
                  <Link to="#" className="user-info__name">
                    {res.user.name}
                  </Link>
                  <span className="user-info__divider"> | </span>
                  <Link to="#" className="user-info__create-date">
                    {res.created_at}
                  </Link>
                </div>
                <h4 className="post__content">{res.user.nick}</h4>
              </div>
            </div>

          </article>
        ))}
      </div>

      {loading && <div>Cargando...</div>}

      {more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver más Usuarios
          </button>
        </div>
      )}
      <br />
    </>
  );
};

export default Followers;
