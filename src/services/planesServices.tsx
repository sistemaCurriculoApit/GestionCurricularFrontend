import { backendBaseUrl, getHeaders } from './constants'

export const getPlanesPaginated = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    let query = `page=${data.page}&search=${data.search}&dateCreationFrom=${data.dateCreationFrom}&dateCreationTo=${data.dateCreationTo}`;
    fetch(`${backendBaseUrl}api/plan/all?${query}`, {
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

export const getAllPlanes = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    let query = `search=${data.search}&planIds=${data.planIds}`;
    fetch(`${backendBaseUrl}api/plan/allNotPaginated?${query}`,{
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

export const getPlanesByListIds = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/plan/byListIds`,{
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

export const getPlanesByListIdsNoToken = async(data:any)=>{
  return new Promise(resolve=>{
    let headers:any = getHeaders();
    fetch(`${backendBaseUrl}api/plan/byListIdsNT`,{
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

export const createPlan = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/plan/add`, {
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

export const updatePlan = async (data: any, id: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/plan/${id}`, {
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