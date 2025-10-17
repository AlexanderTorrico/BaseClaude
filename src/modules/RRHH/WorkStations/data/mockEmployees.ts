/**
 * Mock data para empleados asignados a puestos de trabajo
 * Extiende la estructura de usuarios con información de workstation
 */

export const mockEmployees = [
  {
    id: 1,
    name: "Alexander",
    lastName: "Torrico",
    phone: "+591 70123456",
    email: "admin@gmail.com",
    avatar: null,
    workStation: {
      id: 1,
      name: "Director General",
      level: 0,
      dependency_id: 0
    }
  },
  {
    id: 2,
    name: "María",
    lastName: "González",
    phone: "+591 71234567",
    email: "maria.gonzalez@company.com",
    avatar: null,
    workStation: {
      id: 2,
      name: "Gerente General",
      level: 1,
      dependency_id: 1
    }
  },
  {
    id: 3,
    name: "Carlos",
    lastName: "Mendoza",
    phone: "+591 72345678",
    email: "carlos.mendoza@company.com",
    avatar: null,
    workStation: {
      id: 3,
      name: "Gerente Financiero",
      level: 1,
      dependency_id: 1
    }
  },
  {
    id: 4,
    name: "Ana",
    lastName: "Rodríguez",
    phone: "+591 73456789",
    email: "ana.rodriguez@company.com",
    avatar: null,
    workStation: {
      id: 4,
      name: "Gerente de RRHH",
      level: 1,
      dependency_id: 1
    }
  },
  {
    id: 5,
    name: "Luis",
    lastName: "Fernández",
    phone: "+591 74567890",
    email: "luis.fernandez@company.com",
    avatar: null,
    workStation: {
      id: 5,
      name: "Jefe de Ventas",
      level: 2,
      dependency_id: 2
    }
  },
  {
    id: 6,
    name: "Patricia",
    lastName: "Vargas",
    phone: null,
    email: "patricia.vargas@company.com",
    avatar: null,
    workStation: {
      id: 6,
      name: "Jefe de Marketing",
      level: 2,
      dependency_id: 2
    }
  },
  {
    id: 7,
    name: "Roberto",
    lastName: "Paz",
    phone: "+591 76789012",
    email: "roberto.paz@company.com",
    avatar: null,
    workStation: {
      id: 7,
      name: "Jefe de Operaciones",
      level: 2,
      dependency_id: 2
    }
  },
  {
    id: 8,
    name: "Sandra",
    lastName: "Morales",
    phone: "+591 77890123",
    email: "sandra.morales@company.com",
    avatar: null,
    workStation: {
      id: 8,
      name: "Contador General",
      level: 2,
      dependency_id: 3
    }
  },
  {
    id: 9,
    name: "Jorge",
    lastName: "Ramírez",
    phone: "+591 78901234",
    email: "jorge.ramirez@company.com",
    avatar: null,
    workStation: {
      id: 11,
      name: "Coordinador de Ventas Región Norte",
      level: 3,
      dependency_id: 5
    }
  },
  {
    id: 10,
    name: "Lucía",
    lastName: "Campos",
    phone: null,
    email: "lucia.campos@company.com",
    avatar: null,
    workStation: {
      id: 13,
      name: "Coordinador de Marketing Digital",
      level: 3,
      dependency_id: 6
    }
  },
  {
    id: 11,
    name: "Miguel",
    lastName: "Soto",
    phone: "+591 70111222",
    email: "miguel.soto@company.com",
    avatar: null,
    workStation: {
      id: 16,
      name: "Vendedor Senior",
      level: 4,
      dependency_id: 11
    }
  },
  {
    id: 12,
    name: "Elena",
    lastName: "Cruz",
    phone: "+591 71222333",
    email: "elena.cruz@company.com",
    avatar: null,
    workStation: {
      id: 18,
      name: "Especialista en Redes Sociales",
      level: 4,
      dependency_id: 13
    }
  }
];
