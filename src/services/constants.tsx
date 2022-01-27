const production = true;
export const backendBaseUrl = production ? 'https://curriculo-apit-backend.herokuapp.com/' : 'http://127.0.0.1:3000/';
export const frontendBaseUrl = production ? 'https://curriculo-apit-frontend.herokuapp.com/' : 'http://127.0.0.1:3002/';

export const getHeaders = ()=>{
  let token = localStorage.getItem('token');
  if(token){
    return({
      'Content-Type': 'application/json',
      'access-token':token
    })
  }else{
    return({
      'Content-Type': 'application/json',
    })

  }
};