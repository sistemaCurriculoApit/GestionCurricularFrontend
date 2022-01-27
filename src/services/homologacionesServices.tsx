import { backendBaseUrl, getHeaders } from './constants'

export const getHomologacionesPaginated = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    let query = `page=${data.page}&search=${data.search}&dateCreationFrom=${data.dateCreationFrom}&dateCreationTo=${data.dateCreationTo}`;
    fetch(`${backendBaseUrl}api/homologacion/all?${query}`, {
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

export const getAllHomologaciones = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    let query = `search=${data.search}`;
    fetch(`${backendBaseUrl}api/homologacion/allNotPaginated?${query}`,{
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

export const getAllHomologacionesByIdSolicitante = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/homologacion/allByIdSolicitante`,{
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

export const getAllHomologacionesByPeriodo = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/homologacion/allByPeriodo`,{
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

export const createHomologacion = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/homologacion/add`, {
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

export const updateHomologacion = async (data: any, id: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/homologacion/${id}`, {
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