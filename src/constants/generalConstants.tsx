export const paginationSize = 15;

export const userProfilesObject = {
  admin: {
    id: 1,
    title: 'Administrador',
  },
  coorProg: {
    id: 2,
    title: 'CoordinadorPrograma',
  },
  doc: {
    id: 3,
    title: 'Docente',
  },
  est: {
    id: 4,
    title: 'Estudiante',
  },
  coorArea: {
    id: 5,
    title: 'CoordinadorArea',
  }
};

export const userProfilesArray = Object.values(userProfilesObject);

export const estadosHomologacion = [{ id: 0, title: 'Rechazada' }, { id: 1, title: 'Aceptada' }, { id: 2, title: 'Ingresada' } ];
export const tiposAsignatura = [{ id: 0, title: 'Teorica' }, { id: 1, title: 'Practica' }, { id: 2, title: 'Teorico-Practica' } ];
export const emailDomainRegexValidation = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z]{6,6}?.)+[a-z]{3,3}.([a-z]+[^o]?o$)/g;

export interface AnythingObject {
  [key: string]: any;
}