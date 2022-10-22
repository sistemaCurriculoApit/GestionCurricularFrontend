import { backendBaseUrl, getHeaders } from './constants';

export const getEstudianteByEmail = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/estudiante/getByEmail`, {
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

export const getAllEstudiantes = async () => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}api/estudiante/all`, {
      headers,
      method: 'GET',
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