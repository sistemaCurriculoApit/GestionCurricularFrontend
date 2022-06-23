export const paginationSize = 15;

export const userProfilesObject={
  admin:{
    id:1,
    title:'Administrador',
  },
  coor:{
    id:2,
    title:'Coordinador',
  },
  doc:{
    id:3,
    title:'Docente',
  },
  est:{
    id:4,
    title:'Estudiante',
  }
}
export const userProfilesArray=[
  {
    id:1,
    title:'Administrador',
  },
  {
    id:2,
    title:'Coordinador',
  },
  {
    id:3,
    title:'Docente',
  },
  {
    id:4,
    title:'Estudiante',
  }
]

export const estadosHomologacion= [{ id: 0, title: 'Rechazada' },{ id: 1, title: 'Aceptada' }, { id: 2, title: 'Ingresada' } ]
export const tiposAsignatura= [{ id: 0, title: 'Teorica' },{ id: 1, title: 'Practica' }, { id: 2, title: 'Teorico-Practica' } ]

export interface AnythingObject {
  [key: string]: any;
}