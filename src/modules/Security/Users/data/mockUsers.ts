export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: boolean;
  fechaCreacion: string;
  ultimoAcceso: string;
  telefono: string;
  departamento: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    nombre: "Juan Carlos Pérez",
    email: "juan.perez@empresa.com",
    rol: "Administrador",
    estado: true,
    fechaCreacion: "2024-01-15",
    ultimoAcceso: "2024-09-28",
    telefono: "+1 555-0101",
    departamento: "TI"
  },
  {
    id: 2,
    nombre: "María García López",
    email: "maria.garcia@empresa.com",
    rol: "Usuario",
    estado: true,
    fechaCreacion: "2024-02-20",
    ultimoAcceso: "2024-09-27",
    telefono: "+1 555-0102",
    departamento: "Ventas"
  },
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@empresa.com",
    rol: "Supervisor",
    estado: false,
    fechaCreacion: "2024-01-10",
    ultimoAcceso: "2024-09-20",
    telefono: "+1 555-0103",
    departamento: "Producción"
  },
  {
    id: 4,
    nombre: "Ana Martínez Silva",
    email: "ana.martinez@empresa.com",
    rol: "Usuario",
    estado: true,
    fechaCreacion: "2024-03-05",
    ultimoAcceso: "2024-09-29",
    telefono: "+1 555-0104",
    departamento: "Recursos Humanos"
  },
  {
    id: 5,
    nombre: "Pedro González",
    email: "pedro.gonzalez@empresa.com",
    rol: "Administrador",
    estado: true,
    fechaCreacion: "2024-01-25",
    ultimoAcceso: "2024-09-29",
    telefono: "+1 555-0105",
    departamento: "TI"
  },
  {
    id: 6,
    nombre: "Laura Hernández",
    email: "laura.hernandez@empresa.com",
    rol: "Usuario",
    estado: false,
    fechaCreacion: "2024-04-12",
    ultimoAcceso: "2024-09-15",
    telefono: "+1 555-0106",
    departamento: "Marketing"
  },
  {
    id: 7,
    nombre: "Roberto Díaz",
    email: "roberto.diaz@empresa.com",
    rol: "Supervisor",
    estado: true,
    fechaCreacion: "2024-02-08",
    ultimoAcceso: "2024-09-28",
    telefono: "+1 555-0107",
    departamento: "Finanzas"
  },
  {
    id: 8,
    nombre: "Carmen Torres",
    email: "carmen.torres@empresa.com",
    rol: "Usuario",
    estado: true,
    fechaCreacion: "2024-03-18",
    ultimoAcceso: "2024-09-26",
    telefono: "+1 555-0108",
    departamento: "Legal"
  },
  {
    id: 9,
    nombre: "Miguel Ángel Vargas",
    email: "miguel.vargas@empresa.com",
    rol: "Administrador",
    estado: false,
    fechaCreacion: "2024-01-30",
    ultimoAcceso: "2024-09-10",
    telefono: "+1 555-0109",
    departamento: "TI"
  },
  {
    id: 10,
    nombre: "Sofía Jiménez",
    email: "sofia.jimenez@empresa.com",
    rol: "Usuario",
    estado: true,
    fechaCreacion: "2024-04-25",
    ultimoAcceso: "2024-09-29",
    telefono: "+1 555-0110",
    departamento: "Atención al Cliente"
  },
  {
    id: 11,
    nombre: "Daniel Morales",
    email: "daniel.morales@empresa.com",
    rol: "Supervisor",
    estado: true,
    fechaCreacion: "2024-02-14",
    ultimoAcceso: "2024-09-28",
    telefono: "+1 555-0111",
    departamento: "Logística"
  },
  {
    id: 12,
    nombre: "Patricia Ruiz",
    email: "patricia.ruiz@empresa.com",
    rol: "Usuario",
    estado: false,
    fechaCreacion: "2024-03-22",
    ultimoAcceso: "2024-09-12",
    telefono: "+1 555-0112",
    departamento: "Compras"
  },
  {
    id: 13,
    nombre: "Francisco López",
    email: "francisco.lopez@empresa.com",
    rol: "Administrador",
    estado: true,
    fechaCreacion: "2024-01-05",
    ultimoAcceso: "2024-09-29",
    telefono: "+1 555-0113",
    departamento: "TI"
  },
  {
    id: 14,
    nombre: "Beatriz Sánchez",
    email: "beatriz.sanchez@empresa.com",
    rol: "Usuario",
    estado: true,
    fechaCreacion: "2024-04-08",
    ultimoAcceso: "2024-09-27",
    telefono: "+1 555-0114",
    departamento: "Calidad"
  },
  {
    id: 15,
    nombre: "Alejandro Castro",
    email: "alejandro.castro@empresa.com",
    rol: "Supervisor",
    estado: false,
    fechaCreacion: "2024-02-28",
    ultimoAcceso: "2024-09-18",
    telefono: "+1 555-0115",
    departamento: "Mantenimiento"
  }
];

export const rolesOptions = ["Administrador", "Supervisor", "Usuario"];
export const departamentosOptions = ["TI", "Ventas", "Producción", "Recursos Humanos", "Marketing", "Finanzas", "Legal", "Atención al Cliente", "Logística", "Compras", "Calidad", "Mantenimiento"];
export const estadoOptions = ["Sí", "No"];