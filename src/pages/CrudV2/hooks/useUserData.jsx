import { useState } from "react";
import { generateUsers } from "../data/userGenerator.js";

export const useUserData = () => {
  const [usuarios, setUsuarios] = useState(generateUsers());
  const [modoVista, setModoVista] = useState('cards');

  return {
    usuarios,
    setUsuarios,
    modoVista,
    setModoVista
  };
};