export const generateUsers = () => {
  const nombres = [
    "Ana García", "Carlos López", "María Rodríguez", "Juan Martínez", 
    "Carmen Sánchez", "Antonio González", "Lucía Fernández", "Miguel Jiménez", 
    "Elena Pérez", "David Ruiz"
  ];
  
  const roles = [
    "Administrador", "Editor", "Moderador", "Usuario", 
    "Supervisor", "Analista", "Desarrollador", "Diseñador"
  ];
  
  const departamentos = [
    "Administración", "Recursos Humanos", "Ventas", "Marketing", 
    "IT", "Finanzas", "Operaciones", "Soporte"
  ];
  
  const estados = ["Activo", "Inactivo", "Pendiente", "Suspendido"];
  
  const ciudades = [
    "Madrid", "Barcelona", "Valencia", "Sevilla", 
    "Bilbao", "Málaga", "Zaragoza", "Palma"
  ];
  
  const empresas = [
    "TechSoft", "InnovaCorp", "DataSystems", "CloudWorks", "WebSolutions"
  ];

  return Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    nombre: nombres[index % nombres.length],
    email: nombres[index % nombres.length].toLowerCase().replace(' ', '.') + '@empresa.com',
    telefono: `+34 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
    rol: roles[Math.floor(Math.random() * roles.length)],
    departamento: departamentos[Math.floor(Math.random() * departamentos.length)],
    estado: estados[Math.floor(Math.random() * estados.length)],
    fechaRegistro: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('es-ES'),
    salario: Math.floor(Math.random() * 60000) + 25000,
    ciudad: ciudades[Math.floor(Math.random() * ciudades.length)],
    empresa: empresas[Math.floor(Math.random() * empresas.length)],
    rendimiento: Math.floor(Math.random() * 40) + 60,
    proyectos: Math.floor(Math.random() * 15) + 1,
    experiencia: Math.floor(Math.random() * 15) + 1,
    ultimaActividad: `Hace ${Math.floor(Math.random() * 48) + 1}h`,
  }));
};