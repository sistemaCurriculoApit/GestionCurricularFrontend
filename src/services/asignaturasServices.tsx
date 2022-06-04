import { backendBaseUrl, getHeaders } from './constants'

export const getAsignaturasPaginated = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    let query = `page=${data.page}&search=${data.search}&dateCreationFrom=${data.dateCreationFrom}&dateCreationTo=${data.dateCreationTo}`;
    fetch(`${backendBaseUrl}api/asignatura/all?${query}`, {
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

export const getAllAsignaturas = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    let query = `search=${data.search}`;
    fetch(`${backendBaseUrl}api/asignatura/allNotPaginated?${query}`,{
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

export const getAllAsignaturasWithPlanCode = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    let query = `search=${data.search}`;
    fetch(`${backendBaseUrl}api/asignatura/allNotPaginatedWithPlanCode?${query}`,{
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

export const getAllAsignaturasByPlan = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/asignatura/getAllAsignaturasByPlan`,{
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

export const getAsignaturaByListIds = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/asignatura/byListIds`,{
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

export const getAsignaturaByListIdsPaginated = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/asignatura/byListIdsPaginated`,{
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

export const getAsignaturaByListIdsPaginatedNoToken = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/asignatura/byListIdsPaginatedNT`,{
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

export const createAsignatura = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/asignatura/add`, {
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

export const updateAsignatura = async (data: any, id: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/asignatura/${id}`, {
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