export const generateAtomos = () => {
  const elementosQuimicos = [
    {
      simbolo: "H", nombre: "Hidrógeno", numeroAtomico: 1, pesoAtomico: 1.008,
      grupo: 1, periodo: 1, tipo: "noMetal", estado: "gas",
      configuracionElectronica: "1s¹", puntoFusion: -259.16, puntoEbullicion: -252.87,
      densidad: 0.0899, descubierto: 1766, descubridor: "Henry Cavendish"
    },
    {
      simbolo: "He", nombre: "Helio", numeroAtomico: 2, pesoAtomico: 4.003,
      grupo: 18, periodo: 1, tipo: "gasNoble", estado: "gas",
      configuracionElectronica: "1s²", puntoFusion: -272.2, puntoEbullicion: -268.93,
      densidad: 0.1785, descubierto: 1895, descubridor: "William Ramsay"
    },
    {
      simbolo: "Li", nombre: "Litio", numeroAtomico: 3, pesoAtomico: 6.941,
      grupo: 1, periodo: 2, tipo: "alcalino", estado: "solido",
      configuracionElectronica: "[He] 2s¹", puntoFusion: 180.5, puntoEbullicion: 1342,
      densidad: 0.534, descubierto: 1817, descubridor: "Johan August Arfwedson"
    },
    {
      simbolo: "Be", nombre: "Berilio", numeroAtomico: 4, pesoAtomico: 9.012,
      grupo: 2, periodo: 2, tipo: "alcalinoterreo", estado: "solido",
      configuracionElectronica: "[He] 2s²", puntoFusion: 1287, puntoEbullicion: 2468,
      densidad: 1.85, descubierto: 1798, descubridor: "Louis Nicolas Vauquelin"
    },
    {
      simbolo: "B", nombre: "Boro", numeroAtomico: 5, pesoAtomico: 10.811,
      grupo: 13, periodo: 2, tipo: "metaloide", estado: "solido",
      configuracionElectronica: "[He] 2s² 2p¹", puntoFusion: 2077, puntoEbullicion: 4000,
      densidad: 2.34, descubierto: 1808, descubridor: "Humphry Davy"
    },
    {
      simbolo: "C", nombre: "Carbono", numeroAtomico: 6, pesoAtomico: 12.011,
      grupo: 14, periodo: 2, tipo: "noMetal", estado: "solido",
      configuracionElectronica: "[He] 2s² 2p²", puntoFusion: 3825, puntoEbullicion: 4827,
      densidad: 2.267, descubierto: null, descubridor: "Conocido desde la antigüedad"
    },
    {
      simbolo: "N", nombre: "Nitrógeno", numeroAtomico: 7, pesoAtomico: 14.007,
      grupo: 15, periodo: 2, tipo: "noMetal", estado: "gas",
      configuracionElectronica: "[He] 2s² 2p³", puntoFusion: -210.1, puntoEbullicion: -195.79,
      densidad: 1.251, descubierto: 1772, descubridor: "Daniel Rutherford"
    },
    {
      simbolo: "O", nombre: "Oxígeno", numeroAtomico: 8, pesoAtomico: 15.999,
      grupo: 16, periodo: 2, tipo: "noMetal", estado: "gas",
      configuracionElectronica: "[He] 2s² 2p⁴", puntoFusion: -218.79, puntoEbullicion: -182.96,
      densidad: 1.429, descubierto: 1774, descubridor: "Joseph Priestley"
    },
    {
      simbolo: "F", nombre: "Flúor", numeroAtomico: 9, pesoAtomico: 18.998,
      grupo: 17, periodo: 2, tipo: "noMetal", estado: "gas",
      configuracionElectronica: "[He] 2s² 2p⁵", puntoFusion: -219.67, puntoEbullicion: -188.12,
      densidad: 1.696, descubierto: 1886, descubridor: "Henri Moissan"
    },
    {
      simbolo: "Ne", nombre: "Neón", numeroAtomico: 10, pesoAtomico: 20.180,
      grupo: 18, periodo: 2, tipo: "gasNoble", estado: "gas",
      configuracionElectronica: "[He] 2s² 2p⁶", puntoFusion: -248.59, puntoEbullicion: -246.08,
      densidad: 0.9002, descubierto: 1898, descubridor: "William Ramsay"
    },
    {
      simbolo: "Na", nombre: "Sodio", numeroAtomico: 11, pesoAtomico: 22.990,
      grupo: 1, periodo: 3, tipo: "alcalino", estado: "solido",
      configuracionElectronica: "[Ne] 3s¹", puntoFusion: 97.72, puntoEbullicion: 883,
      densidad: 0.971, descubierto: 1807, descubridor: "Humphry Davy"
    },
    {
      simbolo: "Mg", nombre: "Magnesio", numeroAtomico: 12, pesoAtomico: 24.305,
      grupo: 2, periodo: 3, tipo: "alcalinoterreo", estado: "solido",
      configuracionElectronica: "[Ne] 3s²", puntoFusion: 650, puntoEbullicion: 1090,
      densidad: 1.738, descubierto: 1808, descubridor: "Humphry Davy"
    },
    {
      simbolo: "Al", nombre: "Aluminio", numeroAtomico: 13, pesoAtomico: 26.982,
      grupo: 13, periodo: 3, tipo: "metal", estado: "solido",
      configuracionElectronica: "[Ne] 3s² 3p¹", puntoFusion: 660.32, puntoEbullicion: 2519,
      densidad: 2.70, descubierto: 1825, descubridor: "Hans Christian Ørsted"
    },
    {
      simbolo: "Si", nombre: "Silicio", numeroAtomico: 14, pesoAtomico: 28.085,
      grupo: 14, periodo: 3, tipo: "metaloide", estado: "solido",
      configuracionElectronica: "[Ne] 3s² 3p²", puntoFusion: 1414, puntoEbullicion: 3265,
      densidad: 2.3296, descubierto: 1854, descubridor: "Jöns Jacob Berzelius"
    },
    {
      simbolo: "P", nombre: "Fósforo", numeroAtomico: 15, pesoAtomico: 30.974,
      grupo: 15, periodo: 3, tipo: "noMetal", estado: "solido",
      configuracionElectronica: "[Ne] 3s² 3p³", puntoFusion: 44.15, puntoEbullicion: 280.5,
      densidad: 1.823, descubierto: 1669, descubridor: "Hennig Brand"
    },
    {
      simbolo: "S", nombre: "Azufre", numeroAtomico: 16, pesoAtomico: 32.065,
      grupo: 16, periodo: 3, tipo: "noMetal", estado: "solido",
      configuracionElectronica: "[Ne] 3s² 3p⁴", puntoFusion: 115.21, puntoEbullicion: 444.72,
      densidad: 2.07, descubierto: null, descubridor: "Conocido desde la antigüedad"
    },
    {
      simbolo: "Cl", nombre: "Cloro", numeroAtomico: 17, pesoAtomico: 35.453,
      grupo: 17, periodo: 3, tipo: "noMetal", estado: "gas",
      configuracionElectronica: "[Ne] 3s² 3p⁵", puntoFusion: -101.5, puntoEbullicion: -34.04,
      densidad: 3.214, descubierto: 1774, descubridor: "Carl Wilhelm Scheele"
    },
    {
      simbolo: "Ar", nombre: "Argón", numeroAtomico: 18, pesoAtomico: 39.948,
      grupo: 18, periodo: 3, tipo: "gasNoble", estado: "gas",
      configuracionElectronica: "[Ne] 3s² 3p⁶", puntoFusion: -189.35, puntoEbullicion: -185.85,
      densidad: 1.784, descubierto: 1894, descubridor: "William Ramsay"
    },
    {
      simbolo: "K", nombre: "Potasio", numeroAtomico: 19, pesoAtomico: 39.098,
      grupo: 1, periodo: 4, tipo: "alcalino", estado: "solido",
      configuracionElectronica: "[Ar] 4s¹", puntoFusion: 63.5, puntoEbullicion: 759,
      densidad: 0.89, descubierto: 1807, descubridor: "Humphry Davy"
    },
    {
      simbolo: "Ca", nombre: "Calcio", numeroAtomico: 20, pesoAtomico: 40.078,
      grupo: 2, periodo: 4, tipo: "alcalinoterreo", estado: "solido",
      configuracionElectronica: "[Ar] 4s²", puntoFusion: 842, puntoEbullicion: 1484,
      densidad: 1.55, descubierto: 1808, descubridor: "Humphry Davy"
    }
  ];

  return elementosQuimicos.map((elemento, index) => ({
    id: index + 1,
    ...elemento
  }));
};