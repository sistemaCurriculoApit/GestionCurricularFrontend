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
  }
]

export const estadosHomologacion= [{ id: 0, title: 'Rechazada' },{ id: 1, title: 'Aceptada' } ]

export interface AnythingObject {
  [key: string]: any;
}