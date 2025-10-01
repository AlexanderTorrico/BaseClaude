export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  privilege: string;
  phone: string;
  logo: string;
  language: string;
  status: 'active' | 'inactive';
  modules: any[];
  roles: any[];
  permissions: any[];
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Juan Carlos",
    lastName: "Pérez",
    email: "juan.perez@empresa.com",
    privilege: "admin",
    phone: "+1 555-0101",
    logo: "",
    language: "es",
    status: "active",
    modules: [],
    roles: ["Administrador"],
    permissions: ["read", "write", "delete"]
  },
  {
    id: "2",
    name: "María",
    lastName: "García López",
    email: "maria.garcia@empresa.com",
    privilege: "user",
    phone: "+1 555-0102",
    logo: "",
    language: "es",
    status: "active",
    modules: [],
    roles: ["Usuario"],
    permissions: ["read"]
  },
  {
    id: "3",
    name: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@empresa.com",
    privilege: "supervisor",
    phone: "+1 555-0103",
    logo: "",
    language: "es",
    status: "inactive",
    modules: [],
    roles: ["Supervisor"],
    permissions: ["read", "write"]
  },
  {
    id: "4",
    name: "Ana",
    lastName: "Martínez Silva",
    email: "ana.martinez@empresa.com",
    privilege: "user",
    phone: "+1 555-0104",
    logo: "",
    language: "es",
    status: "active",
    modules: [],
    roles: ["Usuario"],
    permissions: ["read"]
  },
  {
    id: "5",
    name: "Pedro",
    lastName: "González",
    email: "pedro.gonzalez@empresa.com",
    privilege: "admin",
    phone: "+1 555-0105",
    logo: "",
    language: "es",
    status: "active",
    modules: [],
    roles: ["Administrador"],
    permissions: ["read", "write", "delete"]
  },
  {
    id: "6",
    name: "Laura",
    lastName: "Hernández",
    email: "laura.hernandez@empresa.com",
    privilege: "user",
    phone: "+1 555-0106",
    logo: "",
    language: "es",
    status: "inactive",
    modules: [],
    roles: ["Usuario"],
    permissions: ["read"]
  },
  {
    id: "7",
    name: "Roberto",
    lastName: "Díaz",
    email: "roberto.diaz@empresa.com",
    privilege: "supervisor",
    phone: "+1 555-0107",
    logo: "",
    language: "es",
    status: "active",
    modules: [],
    roles: ["Supervisor"],
    permissions: ["read", "write"]
  },
  {
    id: "8",
    name: "Carmen",
    lastName: "Torres",
    email: "carmen.torres@empresa.com",
    privilege: "user",
    phone: "+1 555-0108",
    logo: "",
    language: "es",
    status: "active",
    modules: [],
    roles: ["Usuario"],
    permissions: ["read"]
  }
];

export const privilegeOptions = ["admin", "supervisor", "user"];
export const languageOptions = ["es", "en", "fr", "de"];
export const statusOptions = ["active", "inactive"];