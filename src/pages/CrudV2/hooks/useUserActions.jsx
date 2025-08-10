import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { defaultFormData } from "../utils/constants.js";

export const useUserActions = (usuarios, setUsuarios) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [esEdicion, setEsEdicion] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState(defaultFormData);

  const manejarAgregarUsuario = useCallback(() => {
    setEsEdicion(false);
    setDatosFormulario(defaultFormData);
    setModalAbierto(true);
  }, []);

  const manejarEditarUsuario = useCallback((usuario) => {
    setEsEdicion(true);
    setUsuarioSeleccionado(usuario);
    setDatosFormulario({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol,
      departamento: usuario.departamento,
      estado: usuario.estado,
      ciudad: usuario.ciudad,
      empresa: usuario.empresa,
      salario: usuario.salario,
      experiencia: usuario.experiencia
    });
    setModalAbierto(true);
  }, []);

  const manejarEliminarUsuario = useCallback((usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEliminar(true);
  }, []);

  const manejarGuardarUsuario = useCallback(() => {
    if (!datosFormulario.nombre || !datosFormulario.email) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    if (esEdicion) {
      setUsuarios(usuarios.map(usuario => 
        usuario.id === usuarioSeleccionado.id 
          ? { ...usuario, ...datosFormulario }
          : usuario
      ));
      toast.success("Usuario actualizado correctamente");
    } else {
      const nuevoUsuario = {
        id: Math.max(...usuarios.map(u => u.id)) + 1,
        ...datosFormulario,
        fechaRegistro: new Date().toLocaleDateString('es-ES'),
        rendimiento: Math.floor(Math.random() * 40) + 60,
        proyectos: 0,
        ultimaActividad: "Ahora",
      };
      setUsuarios([nuevoUsuario, ...usuarios]);
      toast.success("Usuario creado correctamente");
    }
    
    setModalAbierto(false);
  }, [datosFormulario, esEdicion, usuarios, usuarioSeleccionado, setUsuarios]);

  const confirmarEliminar = useCallback(() => {
    setUsuarios(usuarios.filter(usuario => usuario.id !== usuarioSeleccionado.id));
    setModalEliminar(false);
    toast.success("Usuario eliminado correctamente");
  }, [usuarios, usuarioSeleccionado, setUsuarios]);

  const manejarEliminarMasivo = useCallback(() => {
    if (usuariosSeleccionados.length === 0) {
      toast.warning("Selecciona usuarios para eliminar");
      return;
    }
    setUsuarios(usuarios.filter(usuario => !usuariosSeleccionados.includes(usuario.id)));
    setUsuariosSeleccionados([]);
    toast.success(`${usuariosSeleccionados.length} usuarios eliminados`);
  }, [usuarios, usuariosSeleccionados, setUsuarios]);

  const toggleModal = useCallback(() => {
    setModalAbierto(!modalAbierto);
  }, [modalAbierto]);

  const toggleDeleteModal = useCallback(() => {
    setModalEliminar(!modalEliminar);
  }, [modalEliminar]);

  return {
    // Estados
    modalAbierto,
    modalEliminar,
    usuarioSeleccionado,
    usuariosSeleccionados,
    esEdicion,
    datosFormulario,
    
    // Setters
    setUsuariosSeleccionados,
    setDatosFormulario,
    
    // Acciones
    manejarAgregarUsuario,
    manejarEditarUsuario,
    manejarEliminarUsuario,
    manejarGuardarUsuario,
    confirmarEliminar,
    manejarEliminarMasivo,
    toggleModal,
    toggleDeleteModal
  };
};