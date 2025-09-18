import React from "react";
import { Badge } from "reactstrap";

export const obtenerBadgeEstado = (estado) => {
  const coloresEstado = {
    "Activo": { color: "success", icon: "mdi-check-circle" },
    "Inactivo": { color: "secondary", icon: "mdi-close-circle" },
    "Pendiente": { color: "warning", icon: "mdi-clock-outline" },
    "Suspendido": { color: "danger", icon: "mdi-alert-circle" }
  };
  const infoEstado = coloresEstado[estado];
  return (
    <Badge color={infoEstado.color} className="d-inline-flex align-items-center">
      <i className={`mdi ${infoEstado.icon} me-1`}></i>
      {estado}
    </Badge>
  );
};

export const obtenerColorRendimiento = (rendimiento) => {
  if (rendimiento >= 90) return "success";
  if (rendimiento >= 70) return "info";
  if (rendimiento >= 50) return "warning";
  return "danger";
};
