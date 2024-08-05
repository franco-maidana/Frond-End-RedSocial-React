import Global from "./Global"



const GetProfile = async(userId, setState) => {
  const request = await fetch(Global.url + "users/profile/" + userId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    }
  })
  const data = await request.json()

  if(data.statusCode == 200 ){
    setState(data.user)
  } 

  return data;
}

export default GetProfile