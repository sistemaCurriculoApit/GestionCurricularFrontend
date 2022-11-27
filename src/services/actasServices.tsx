import { backendBaseUrl, getHeaders } from './constants';

export const getActasPaginated = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    let query = `page=${data.page}&search=${data.search}&dateCreationFrom=${data.dateCreationFrom}&dateCreationTo=${data.dateCreationTo}&dateActaFrom=${data.dateActaFrom}&dateActaTo=${data.dateActaTo}`;
    fetch(`${backendBaseUrl}/api/acta/all?${query}`, {
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

export const createActa = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}/api/acta/add`, {
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

export const updateActa = async (data: any, id: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}/api/acta/${id}`, {
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

export const removeActa = async (actaId: string): Promise<null | void> => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}/api/acta/${actaId}`, {
      headers,
      method: 'DELETE'
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