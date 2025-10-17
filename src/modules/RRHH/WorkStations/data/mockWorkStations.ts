/**
 * Mock data para puestos de trabajo (Work Stations)
 * Estructura jerárquica basada en dependency_id
 */

export const mockWorkStations = [
  // Nivel 0 - Raíz (Directivo)
  {
    id: 1,
    name: "Director General",
    level: 0,
    dependency_id: 0  // 0 = Raíz del organigrama
  },

  // Nivel 1 - Gerencias (Gerencial)
  {
    id: 2,
    name: "Gerente General",
    level: 1,
    dependency_id: 1  // Depende del Director (id=1)
  },
  {
    id: 3,
    name: "Gerente Financiero",
    level: 1,
    dependency_id: 1  // Depende del Director (id=1)
  },
  {
    id: 4,
    name: "Gerente de RRHH",
    level: 1,
    dependency_id: 1  // Depende del Director (id=1)
  },

  // Nivel 2 - Jefaturas (Jefatura)
  {
    id: 5,
    name: "Jefe de Ventas",
    level: 2,
    dependency_id: 2  // Depende del Gerente General (id=2)
  },
  {
    id: 6,
    name: "Jefe de Marketing",
    level: 2,
    dependency_id: 2  // Depende del Gerente General (id=2)
  },
  {
    id: 7,
    name: "Jefe de Operaciones",
    level: 2,
    dependency_id: 2  // Depende del Gerente General (id=2)
  },
  {
    id: 8,
    name: "Contador General",
    level: 2,
    dependency_id: 3  // Depende del Gerente Financiero (id=3)
  },
  {
    id: 9,
    name: "Jefe de Tesorería",
    level: 2,
    dependency_id: 3  // Depende del Gerente Financiero (id=3)
  },
  {
    id: 10,
    name: "Jefe de Reclutamiento",
    level: 2,
    dependency_id: 4  // Depende del Gerente de RRHH (id=4)
  },

  // Nivel 3 - Coordinaciones (Coordinación)
  {
    id: 11,
    name: "Coordinador de Ventas Región Norte",
    level: 3,
    dependency_id: 5  // Depende del Jefe de Ventas (id=5)
  },
  {
    id: 12,
    name: "Coordinador de Ventas Región Sur",
    level: 3,
    dependency_id: 5  // Depende del Jefe de Ventas (id=5)
  },
  {
    id: 13,
    name: "Coordinador de Marketing Digital",
    level: 3,
    dependency_id: 6  // Depende del Jefe de Marketing (id=6)
  },
  {
    id: 14,
    name: "Coordinador de Contenidos",
    level: 3,
    dependency_id: 6  // Depende del Jefe de Marketing (id=6)
  },
  {
    id: 15,
    name: "Coordinador de Logística",
    level: 3,
    dependency_id: 7  // Depende del Jefe de Operaciones (id=7)
  },

  // Nivel 4 - Operativo
  {
    id: 16,
    name: "Vendedor Senior",
    level: 4,
    dependency_id: 11  // Depende del Coordinador Norte (id=11)
  },
  {
    id: 17,
    name: "Vendedor Junior",
    level: 4,
    dependency_id: 11  // Depende del Coordinador Norte (id=11)
  },
  {
    id: 18,
    name: "Especialista en Redes Sociales",
    level: 4,
    dependency_id: 13  // Depende del Coordinador de Marketing Digital (id=13)
  },
  {
    id: 19,
    name: "Analista Contable",
    level: 4,
    dependency_id: 8  // Depende del Contador General (id=8)
  },
  {
    id: 20,
    name: "Asistente de Reclutamiento",
    level: 4,
    dependency_id: 10  // Depende del Jefe de Reclutamiento (id=10)
  }
];

/**
 * Datos de empleados por puesto de trabajo
 * Cantidad de empleados asignados a cada workstation
 */
export const mockEmployeeCountByWorkStation: Record<number, number> = {
  1: 1,   // Director General: 1 empleado
  2: 2,   // Gerente General: 2 empleados
  3: 1,   // Gerente Financiero: 1 empleado
  4: 1,   // Gerente de RRHH: 1 empleado
  5: 3,   // Jefe de Ventas: 3 empleados
  6: 2,   // Jefe de Marketing: 2 empleados
  7: 2,   // Jefe de Operaciones: 2 empleados
  8: 2,   // Contador General: 2 empleados
  9: 1,   // Jefe de Tesorería: 1 empleado
  10: 1,  // Jefe de Reclutamiento: 1 empleado
  11: 5,  // Coordinador Ventas Norte: 5 empleados
  12: 4,  // Coordinador Ventas Sur: 4 empleados
  13: 3,  // Coordinador Marketing Digital: 3 empleados
  14: 2,  // Coordinador Contenidos: 2 empleados
  15: 4,  // Coordinador Logística: 4 empleados
  16: 0,  // Vendedor Senior: 0 (es puesto operativo individual)
  17: 0,  // Vendedor Junior: 0
  18: 0,  // Especialista Redes Sociales: 0
  19: 0,  // Analista Contable: 0
  20: 0   // Asistente Reclutamiento: 0
};
