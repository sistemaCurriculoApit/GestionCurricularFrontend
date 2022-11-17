import { Homologation } from '../models';
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
    const url = `${backendBaseUrl}/api/homologations?${queryString}`;
    const response = await fetch(url, { headers, method: 'GET' });
    return await response.json();
  } catch (e) {
    console.error(e);
    return { homologations: [], homologationsCount: 0 };
  }
};

export const getHomologationsPeriods = async (signal?: AbortSignal): Promise<string[]> => {
  try {
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/homologations/periods`;
    const { periods }: { periods: string[] } = await fetch(url, { headers, signal }).then((res) => res.json());
    return periods;
  } catch {
    return [];
  }
};

export const getHomologationsByApplicant = async (applicantId: string, query: HomologationsQuery): Promise<HomologationsResponse> => {
  try {
    const queryString = buildQuery(query);
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/homologations/applicants/${applicantId}?${queryString}`;
    const response = await fetch(url, { headers, method: 'GET' });
    return await response.json();
  } catch (e) {
    console.error(e);
    return { homologations: [], homologationsCount: 0 };
  }
};

export const getHomologationsByPeriods = async (period: string, query: HomologationsQuery): Promise<HomologationsResponse> => {
  try {
    const queryString = buildQuery(query);
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/homologations/periods/${period}?${queryString}`;
    const response = await fetch(url, { headers, method: 'GET' });
    return await response.json();
  } catch (e) {
    console.error(e);
    return { homologations: [], homologationsCount: 0 };
  }
};

export const createHomologation = async (homologation: Homologation): Promise<any> => {
  try {
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/homologations`;
    const response = await fetch(url, { headers, method: 'POST', body: JSON.stringify(homologation) });
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const updateHomologations = async (homologationId: string, homologation: Homologation): Promise<any> => {
  try {
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/homologations/${homologationId}`;
    const response = await fetch(url, { headers, method: 'PUT', body: JSON.stringify(homologation) });
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const removeHomologations = async (homologationId: string): Promise<null | void> => {
  try {
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/homologations/${homologationId}`;
    const response = await fetch(url, { headers, method: 'DELETE'});
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

