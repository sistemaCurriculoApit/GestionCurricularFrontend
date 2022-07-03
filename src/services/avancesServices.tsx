import { backendBaseUrl, getHeaders } from './constants'

export const getAvancesPaginated = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    let query = `page=${data.page}&search=${data.search}&dateCreationFrom=${data.dateCreationFrom}&dateCreationTo=${data.dateCreationTo}`;
    fetch(`${backendBaseUrl}api/avance/all?${query}`, {
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

export const getAllAvances = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    let query = `search=${data.search}`;
    fetch(`${backendBaseUrl}api/avance/allNotPaginated?${query}`,{
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


export const getAllAvancesByAsignatura = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/avance/allByAsignatura`,{
      headers,
      method: 'POST',
      body: JSON.stringify(data)
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


export const getAllAvancesByDocenteEmail = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    let query = `search=${data.search}`;
    let emailDocente = `emailDocente=${data.emailDocente}`
    fetch(`${backendBaseUrl}api/avance/allByDocenteEmail?${emailDocente}&${query}`,{
      headers,
      method: 'GET',
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

export const getAllAvancesByDocente = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/avance/allByDocente`,{
      headers,
      method: 'POST',
      body: JSON.stringify(data)
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



export const getAllAvancesByPerido = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/avance/allByPeriodo`,{
      headers,
      method: 'POST',
      body: JSON.stringify(data)
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

export const createAvance = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/avance/add`, {
      headers,
      method: 'POST',
      body: JSON.stringify(data)
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

export const updateAvance = async (data: any, id: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/avance/${id}`, {
      headers,
      method: 'PATCH',
      body: JSON.stringify(data)
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