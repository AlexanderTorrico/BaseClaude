/**
 * Mock data para requisitos de puestos de trabajo
 */

export const mockRequirements = [
  // Requisitos para Director General (id=1)
  {
    id: 1,
    description: "Maestría en Administración de Empresas (MBA)",
    rhh_workstation_id: 1,
    category: "Educación",
    is_required: true
  },
  {
    id: 2,
    description: "15 años de experiencia en dirección ejecutiva",
    rhh_workstation_id: 1,
    category: "Experiencia",
    is_required: true
  },
  {
    id: 3,
    description: "Habilidades de liderazgo estratégico",
    rhh_workstation_id: 1,
    category: "Competencias",
    is_required: true
  },
  {
    id: 4,
    description: "Visión de negocio y planificación a largo plazo",
    rhh_workstation_id: 1,
    category: "Competencias",
    is_required: true
  },

  // Requisitos para Gerente General (id=2)
  {
    id: 5,
    description: "Licenciatura en Administración de Empresas",
    rhh_workstation_id: 2,
    category: "Educación",
    is_required: true
  },
  {
    id: 6,
    description: "10 años de experiencia gerencial",
    rhh_workstation_id: 2,
    category: "Experiencia",
    is_required: true
  },
  {
    id: 7,
    description: "Gestión de equipos multidisciplinarios",
    rhh_workstation_id: 2,
    category: "Competencias",
    is_required: true
  },
  {
    id: 8,
    description: "MBA o Maestría en Administración",
    rhh_workstation_id: 2,
    category: "Educación",
    is_required: false
  },

  // Requisitos para Gerente Financiero (id=3)
  {
    id: 9,
    description: "Licenciatura en Contabilidad o Finanzas",
    rhh_workstation_id: 3,
    category: "Educación",
    is_required: true
  },
  {
    id: 10,
    description: "8 años de experiencia en gestión financiera",
    rhh_workstation_id: 3,
    category: "Experiencia",
    is_required: true
  },
  {
    id: 11,
    description: "Certificación CPA o similar",
    rhh_workstation_id: 3,
    category: "Certificaciones",
    is_required: true
  },
  {
    id: 12,
    description: "Conocimiento avanzado de Excel y ERP",
    rhh_workstation_id: 3,
    category: "Habilidades Técnicas",
    is_required: true
  },

  // Requisitos para Gerente de RRHH (id=4)
  {
    id: 13,
    description: "Licenciatura en Psicología o Administración de RRHH",
    rhh_workstation_id: 4,
    category: "Educación",
    is_required: true
  },
  {
    id: 14,
    description: "6 años de experiencia en gestión de talento",
    rhh_workstation_id: 4,
    category: "Experiencia",
    is_required: true
  },
  {
    id: 15,
    description: "Conocimiento de legislación laboral",
    rhh_workstation_id: 4,
    category: "Competencias",
    is_required: true
  },

  // Requisitos para Jefe de Ventas (id=5)
  {
    id: 16,
    description: "Licenciatura en Marketing o Administración",
    rhh_workstation_id: 5,
    category: "Educación",
    is_required: true
  },
  {
    id: 17,
    description: "5 años de experiencia en ventas B2B",
    rhh_workstation_id: 5,
    category: "Experiencia",
    is_required: true
  },
  {
    id: 18,
    description: "Conocimiento de CRM (Salesforce, HubSpot)",
    rhh_workstation_id: 5,
    category: "Habilidades Técnicas",
    is_required: false
  },
  {
    id: 19,
    description: "Habilidades de negociación avanzadas",
    rhh_workstation_id: 5,
    category: "Competencias",
    is_required: true
  },

  // Requisitos para Jefe de Marketing (id=6)
  {
    id: 20,
    description: "Licenciatura en Marketing o Comunicación",
    rhh_workstation_id: 6,
    category: "Educación",
    is_required: true
  },
  {
    id: 21,
    description: "4 años de experiencia en marketing digital",
    rhh_workstation_id: 6,
    category: "Experiencia",
    is_required: true
  },
  {
    id: 22,
    description: "Conocimiento de Google Analytics y SEO",
    rhh_workstation_id: 6,
    category: "Habilidades Técnicas",
    is_required: true
  },
  {
    id: 23,
    description: "Creatividad y pensamiento estratégico",
    rhh_workstation_id: 6,
    category: "Competencias",
    is_required: true
  },

  // Requisitos para Contador General (id=8)
  {
    id: 24,
    description: "Licenciatura en Contabilidad",
    rhh_workstation_id: 8,
    category: "Educación",
    is_required: true
  },
  {
    id: 25,
    description: "3 años de experiencia en contabilidad general",
    rhh_workstation_id: 8,
    category: "Experiencia",
    is_required: true
  },
  {
    id: 26,
    description: "Manejo de sistemas contables (SAP, Tango, etc.)",
    rhh_workstation_id: 8,
    category: "Habilidades Técnicas",
    is_required: true
  },

  // Requisitos para Coordinador de Ventas (id=11)
  {
    id: 27,
    description: "Técnico o Licenciatura en Administración",
    rhh_workstation_id: 11,
    category: "Educación",
    is_required: true
  },
  {
    id: 28,
    description: "2 años de experiencia en ventas",
    rhh_workstation_id: 11,
    category: "Experiencia",
    is_required: true
  },
  {
    id: 29,
    description: "Excelentes habilidades de comunicación",
    rhh_workstation_id: 11,
    category: "Competencias",
    is_required: true
  },

  // Requisitos para Coordinador de Marketing Digital (id=13)
  {
    id: 30,
    description: "Licenciatura en Marketing o Comunicación",
    rhh_workstation_id: 13,
    category: "Educación",
    is_required: true
  },
  {
    id: 31,
    description: "2 años de experiencia en marketing digital",
    rhh_workstation_id: 13,
    category: "Experiencia",
    is_required: true
  },
  {
    id: 32,
    description: "Dominio de redes sociales y herramientas de pauta digital",
    rhh_workstation_id: 13,
    category: "Habilidades Técnicas",
    is_required: true
  },

  // Requisitos para Vendedor Senior (id=16)
  {
    id: 33,
    description: "Bachiller con experiencia comprobable",
    rhh_workstation_id: 16,
    category: "Educación",
    is_required: true
  },
  {
    id: 34,
    description: "3 años de experiencia en ventas",
    rhh_workstation_id: 16,
    category: "Experiencia",
    is_required: true
  },
  {
    id: 35,
    description: "Orientación a resultados",
    rhh_workstation_id: 16,
    category: "Competencias",
    is_required: true
  },

  // Requisitos para Especialista en Redes Sociales (id=18)
  {
    id: 36,
    description: "Técnico en Comunicación o Marketing",
    rhh_workstation_id: 18,
    category: "Educación",
    is_required: true
  },
  {
    id: 37,
    description: "1 año de experiencia gestionando redes sociales",
    rhh_workstation_id: 18,
    category: "Experiencia",
    is_required: true
  },
  {
    id: 38,
    description: "Conocimiento de herramientas de diseño (Canva, Photoshop)",
    rhh_workstation_id: 18,
    category: "Habilidades Técnicas",
    is_required: false
  },
  {
    id: 39,
    description: "Creatividad y capacidad de storytelling",
    rhh_workstation_id: 18,
    category: "Competencias",
    is_required: true
  }
];
