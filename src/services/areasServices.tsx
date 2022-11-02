import { backendBaseUrl, getHeaders } from './constants';

export const getAreasPaginated = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    let query = `page=${data.page}&search=${data.search}&dateCreationFrom=${data.dateCreationFrom}&dateCreationTo=${data.dateCreationTo}`;
    fetch(`${backendBaseUrl}api/area/all?${query}`, {
      headers,
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        resolve(response);
      })
      .catch(error => resolve({
        ...error
      }));
  });
};

export const getAllAreas = async(data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    let query = `search=${data.search}`;
    fetch(`${backendBaseUrl}api/area/allNotPaginated?${query}`, {
      headers,
      method: 'GET'
    })
    .then(response => response.json())
    .then(response => {
      resolve(response);
    })
    .catch(error => resolve({ 
      ...error 
    }));
  });
};

export const getAreasByListIds = async(data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/area/byListIds`, {
      headers,
      method: 'POST',
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
      resolve(response);
    })
    .catch(error => resolve({ 
      ...error 
    }));
  });
};

export const getAreasByListIdsNoToken = async(data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/area/byListIdsNT`, {
      headers,
      method: 'POST',
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
      resolve(response);
    })
    .catch(error => resolve({ 
      ...error 
    }));
  });
};

export const createArea = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/area/add`, {
      headers,
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(response => {
        resolve(response);
      })
      .catch(error => resolve({
        ...error
      }));
  });
};

export const updateArea = async (data: any, id: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/area/${id}`, {
      headers,
      method: 'PATCH',
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(response => {
        resolve(response);
      })
      .catch(error => resolve({
        ...error
      }));
  });
};