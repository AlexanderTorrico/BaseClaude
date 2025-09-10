import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

/**
 * AddNewUserCard - Card reutilizable para agregar nuevos registros
 * Componente que muestra una card con un botón para agregar nuevos elementos
 * 
 * @param {Function} [onAdd] - Callback cuando se hace click en agregar
 * @param {string} [title="Agregar nuevo registro"] - Título de la card
 * @param {string} [buttonText="Agregar"] - Texto del botón
 * @param {string} [buttonColor="primary"] - Color del botón
 * @param {string} [buttonVariant="outline"] - Variante del botón (solid/outline)
 * @param {string} [icon="mdi-plus"] - Icono a mostrar
 * @param {string} [className] - Clases CSS adicionales
 * @param {string} [gridCols] - Clases de columnas para responsive
 */
const AddNewUserCard = React.memo(({
  onAdd,
  title = "Agregar nuevo registro",
  buttonText = "Agregar",
  buttonColor = "primary",
  buttonVariant = "outline",
  icon = "mdi-plus",
  className = "",
  gridCols = "col-lg-3 col-md-4 col-sm-6"
}) => {
  // Memoizar handler para optimización
  const handleAdd = React.useCallback(() => {
    if (onAdd) {
      onAdd();
    } else {
      console.log('Agregar nuevo elemento');
    }
  }, [onAdd]);

  // Memoizar el icono para evitar recreación
  const iconElement = React.useMemo(() => (
    <i className={`mdi ${icon} text-muted fs-2`}></i>
  ), [icon]);

  // Determinar props del botón basado en variant
  const buttonProps = React.useMemo(() => {
    const baseProps = {
      color: buttonColor,
      size: "sm",
      onClick: handleAdd,
      className: "d-flex align-items-center gap-1"
    };

    if (buttonVariant === "outline") {
      baseProps.outline = true;
    }

    return baseProps;
  }, [buttonColor, buttonVariant, handleAdd]);

  return (
    <div className={gridCols}>
      <div className={`card text-center ${className}`}>
        <div className="card-body">
          <div className="text-center p-4">
            <div className="avatar-lg mx-auto mb-3 border border-dashed rounded d-flex align-items-center justify-content-center">
              {iconElement}
            </div>
            <p className="text-muted mb-3">{title}</p>
            <Button {...buttonProps}>
              <i className={`mdi ${icon} me-1`}></i>
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

AddNewUserCard.propTypes = {
  onAdd: PropTypes.func,
  title: PropTypes.string,
  buttonText: PropTypes.string,
  buttonColor: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'info', 
    'warning', 'danger', 'light', 'dark'
  ]),
  buttonVariant: PropTypes.oneOf(['solid', 'outline']),
  icon: PropTypes.string,
  className: PropTypes.string,
  gridCols: PropTypes.string
};

AddNewUserCard.displayName = "AddNewUserCard";

export default AddNewUserCard;