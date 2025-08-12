import { useState } from "react";
import { generateUsers } from "../CrudUtils/userGenerator.js";

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