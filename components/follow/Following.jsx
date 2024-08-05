import React, { useEffect, useState } from "react";
import Global from "../../helpers/Global";
import { Link, useParams } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import GetProfile from "../../helpers/GetProfile";

const Following = () => {
  const { Auth } = useAuth();
  const [user, setUser] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);
  const [profile, setProfile] = useState({})

  const params = useParams()

  useEffect(() => {
    getUsers(page);
    GetProfile(params.userId , setProfile)
  }, [page]);

  const getUsers = async (nextPage) => {
    setLoading(true);

    // Sacar userId de la url
    const userId = params.userId

    const request = await fetch(Global.url + "follow/seguidos/"+ userId + '/' + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    let cleanUsers = []
    data.follows.forEach(follow => {
      cleanUsers = [...cleanUsers, follow.followed]
    })
    data.users = cleanUsers


    if (data.follows && data.statusCode === 200) {
      let newUser = data.follows;
      if (user.length >= 1) {
        newUser = [...user, ...data.follows];
      }

      setUser(newUser); // 5 
      setFollowing(data.usuariosFollowIds.following); // aca esta el problema includes is no definido
      setLoading(false);

      
      
      if (user.length >= (data.totalFollows - data.users.length)) {
        setMore(false);
      }
      
    }
  };

  const nextPage = () => {
    setPage(page + 1);
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
      setFollowing([...following, userId]);
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
      let filtered = following.filter((followingUserId) => userId !== followingUserId);
      setFollowing(filtered);
    }
  };

  if (!user || !Auth) {
    return <div>Cargando...</div>;
  }


  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Usuarios que sigue {profile.name}</h1>
      </header>
      <div className="content__posts">
        {user.map((res) => (
          <article className="posts__post" key={res._id}>
            <div className="post__container">
              <div className="post__image-user">
                <Link to="#" className="post__image-link">
                  <img
                    src={
                      res.followed.image &&
                      res.followed.image !== "https://i.postimg.cc/wTgNFWhR/profile.png"
                        ? `${Global.url}users/avatar/${res.followed.image}`
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
                    {res.followed.name}
                  </Link>
                  <span className="user-info__divider"> | </span>
                  <Link to="#" className="user-info__create-date">
                    {res.created_at}
                  </Link>
                </div>

                <h4 className="post__content">{res.followed.nick}</h4>
              </div>
            </div>

            {res.followed._id !== Auth._id && (
              <div className="post__buttons">
                {!following.includes(res.followed._id) ? (
                  <button className="post__button post__button--green" onClick={() => follow(res.followed._id)}> Seguir </button>) :
                  (<button className="post__button" onClick={() => unFollow(res.followed._id)} >Dejar de seguir</button> )}
              </div>
            )}
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

export default Following;
