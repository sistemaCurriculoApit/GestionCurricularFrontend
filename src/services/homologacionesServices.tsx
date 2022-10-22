import { backendBaseUrl, getHeaders, buildQuery } from './constants';

type HomologationsQuery = {
  query?: string,
  paginated?: boolean,
  page?: number,
  period?: number,
  homologationYear?: string,
  search?: string,
  dateCreationFrom?: any,
  dateCreationTo?: any,
  email?: string
};

export interface HomologationsResponse {
  homologations: any[];
  homologationsCount: number;
}

export const getHomologations = async (query: HomologationsQuery): Promise<HomologationsResponse> => {
  try {
    const queryString = buildQuery(query);
    const headers = getHeaders();
    const url = `${backendBaseUrl}api/homologations?${queryString}`;
    const response = await fetch(url, { headers, method: 'GET' });
    return await response.json();
  } catch (e) {
    console.error(e);
    return {} as HomologationsResponse;
  }
};

export const getHomologationsByApplicant = async (applicantId: string, query: HomologationsQuery): Promise<HomologationsResponse> => {
  try {
    const queryString = buildQuery(query);
    const headers = getHeaders();
    const url = `${backendBaseUrl}api/homologations/applicants/${applicantId}?${queryString}`;
    const response = await fetch(url, { headers, method: 'GET' });
    return await response.json();
  } catch (e) {
    console.error(e);
    return {} as HomologationsResponse;
  }
};

export const getHomologationsByPeriods = async (period: string, query: HomologationsQuery): Promise<HomologationsResponse> => {
  try {
    const queryString = buildQuery(query);
    const headers = getHeaders();
    const url = `${backendBaseUrl}api/homologations/periods/${period}?${queryString}`;
    const response = await fetch(url, { headers, method: 'GET' });
    return await response.json();
  } catch (e) {
    console.error(e);
    return {} as HomologationsResponse;
  }
};

export const createHomologation = async (homologation: any): Promise<any> => {
  try {
    const headers = getHeaders();
    const url = `${backendBaseUrl}api/homologations`;
    const response = await fetch(url, { headers, method: 'POST', body: JSON.stringify(homologation) });
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const updateHomologations = async (homologationId: string, homologation: any): Promise<any> => {
  try {
    const headers = getHeaders();
    const url = `${backendBaseUrl}api/homologations/${homologationId}`;
    const response = await fetch(url, { headers, method: 'PUT', body: JSON.stringify(homologation) });
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};
