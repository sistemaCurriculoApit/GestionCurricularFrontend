import { backendBaseUrl, getHeaders } from './constants';

export const getProgramasPaginated = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    let query = `page=${data.page}&search=${data.search}&dateCreationFrom=${data.dateCreationFrom}&dateCreationTo=${data.dateCreationTo}`;
    fetch(`${backendBaseUrl}/api/programa/all?${query}`, {
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

export const getAllProgramas = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    let query = `search=${data.search}`;
    fetch(`${backendBaseUrl}/api/programa/allNotPaginated?${query}`, {
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

export const getAllProgramasNoToken = async (data: any): Promise<any> => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    let query = `search=${data.search}`;
    fetch(`${backendBaseUrl}/api/programa/allNotPaginatedNT?${query}`, {
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

export const getProgramasPopulated = async (): Promise<any> => {
  try {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return await fetch(`${backendBaseUrl}/api/programa/`, { headers })
      .then((response) => response.ok ? response.json() : { programs: [] })
      .then((response) => response.programs)
      .catch(() => [])
  } catch {
    return [];
  }
};

export const createPrograma = async (data: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}/api/programa/add`, {
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

export const updatePrograma = async (data: any, id: any) => {
  return new Promise(resolve => {
    let headers: any = getHeaders();
    fetch(`${backendBaseUrl}/api/programa/${id}`, {
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