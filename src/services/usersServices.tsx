import {backendBaseUrl,getHeaders} from './constants'

export const getUserPaginated = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    let query = `page=${data.page}&search=${data.search}&dateCreationFrom=${data.dateCreationFrom}&dateCreationTo=${data.dateCreationTo}`;
    fetch(`${backendBaseUrl}api/user/all?${query}`,{
      headers,
      method: 'GET'
    })
    .then(response => response.json())
    .then(response => {
      resolve(response)
    })
    .catch(error => resolve({ 
      ...error 
    }));
  });
}

export const createUser = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/user/add`,{
      headers,
      method: 'POST', 
      body:JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
      resolve(response)
    })
    .catch(error => resolve({ 
      ...error 
    }));
  });
}

export const updateUser = async(data:any, id:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/user/${id}`,{
      headers,
      method: 'PATCH', 
      body:JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
      resolve(response)
    })
    .catch(error => resolve({ 
      ...error 
    }));
  });
}