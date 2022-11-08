import { Advancement, Subject } from '../models';
import { backendBaseUrl, getHeaders, buildQuery } from './constants';

type AdvancementsQuery = {
  query?: string,
  paginated?: boolean,
  page?: number,
  period?: number,
  advancementYear?: string,
  search?: string,
  dateCreationFrom?: any,
  dateCreationTo?: any,
  email?: string
};

export interface AdvancementsResponse {
  advancements: any[];
  advancementsCount: number;
}

export const getAdvancements = async (query: AdvancementsQuery): Promise<AdvancementsResponse> => {
  try {
    const queryString = buildQuery(query);
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/advancements?${queryString}`;
    const response = await fetch(url, { headers, method: 'GET' });
    return await response.json();
  } catch (e) {
    console.error(e);
    return { advancements: [], advancementsCount: 0 };
  }
};

export const getAdvancementsPeriods = async (signal?: AbortSignal): Promise<string[]> => {
  try {
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/advancements/periods`;
    const { periods }: { periods: string[] } = await fetch(url, { headers, signal }).then((res) => res.json())
    return periods;
  } catch {
    return [];
  }
};

export const getAdvancementsSubjects = async (year: string, period: string, signal?: AbortSignal): Promise<Subject[]> => {
  try {
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/advancements/years/${year}/periods/${period}/subjects`;
    const { subjects }: { subjects: Subject[] } = await fetch(url, { headers, signal }).then((res) => res.json())
    return subjects;
  } catch {
    return [];
  }
};

export const getAdvancementsProfessors = async (year: string, period: string, signal?: AbortSignal): Promise<Subject[]> => {
  try {
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/advancements/years/${year}/periods/${period}/professors`;
    const { professors }: { professors: any[] } = await fetch(url, { headers, signal }).then((res) => res.json())
    return professors;
  } catch {
    return [];
  }
};

export const getAdvancementsBySubject = async (subjectId: string, query: AdvancementsQuery): Promise<AdvancementsResponse> => {
  try {
    const queryString = buildQuery(query);
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/advancements/subjects/${subjectId}?${queryString}`;
    const response = await fetch(url, { headers, method: 'GET' });
    return await response.json();
  } catch (e) {
    console.error(e);
    return { advancements: [], advancementsCount: 0 };
  }
};

export const getAdvancementsByProfessorsEmail = async (query: AdvancementsQuery): Promise<AdvancementsResponse> => {
  try {
    const queryString = buildQuery(query);
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/advancements/professors?${queryString}`;
    const response = await fetch(url, { headers, method: 'GET' });
    return await response.json();
  } catch (e) {
    console.error(e);
    return { advancements: [], advancementsCount: 0 };
  }
};

export const getAdvancementsByProfessors = async (professorId: string, query: AdvancementsQuery): Promise<AdvancementsResponse> => {
  try {
    const queryString = buildQuery(query);
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/advancements/professors/${professorId}?${queryString}`;
    const response = await fetch(url, { headers, method: 'GET' });
    return await response.json();
  } catch (e) {
    console.error(e);
    return { advancements: [], advancementsCount: 0 };
  }
};

export const getAdvancementsByPeriods = async (period: string, query: AdvancementsQuery): Promise<AdvancementsResponse> => {
  try {
    const queryString = buildQuery(query);
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/advancements/periods/${period}?${queryString}`;
    const response = await fetch(url, { headers, method: 'GET' });
    return await response.json();
  } catch (e) {
    console.error(e);
    return { advancements: [], advancementsCount: 0 };
  }
};

export const createAdvancement = async (advancement: Advancement): Promise<any> => {
  try {
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/advancements`;
    const response = await fetch(url, { headers, method: 'POST', body: JSON.stringify(advancement) });
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const updateAdvancement = async (advancementId: string, advancement: Advancement & any): Promise<any> => {
  try {
    const headers = getHeaders();
    const url = `${backendBaseUrl}/api/advancements/${advancementId}`;
    const response = await fetch(url, { headers, method: 'PUT', body: JSON.stringify(advancement) });
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};
