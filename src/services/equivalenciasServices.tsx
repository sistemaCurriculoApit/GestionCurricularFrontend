import { backendBaseUrl, getHeaders } from './constants';

export const getEquivalenciasPaginated = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    let query = `page=${data.page}&search=${data.search}`;
    fetch(`${backendBaseUrl}api/equivalencia/all?${query}`, {
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

export const getAllEquivalencias = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    let query = `search=${data.search}`;
    fetch(`${backendBaseUrl}api/equivalencia/allNotPaginated?${query}`, {
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

export const getAllEquivalenciaByAsignatura = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/asignatura/getEquivalenciaByAsignatura`, {
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

export const getAllEquivalenciaByAsignaturaNoToken = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/asignatura/getEquivalenciaByAsignaturaNT`, {
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

export const createEquivalencia = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/equivalencia/add`, {
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

export const updateEquivalencia = async (data: any, id: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/equivalencia/${id}`, {
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