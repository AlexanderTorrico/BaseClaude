import PropTypes from "prop-types";
import React from "react";
import {
  Container
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import AtomoCrudFacadeExample
import AtomoCrudFacadeExample from "./AtomoCrudFacadeExample";

//i18n
import { withTranslation } from "react-i18next";

const Atomo = (props) => {

  //meta title
  document.title = "Atomo CRUD | Skote - Vite React Admin & Dashboard Template";

  return (
     <React.Fragment>
      <div className="page-content">
        <h1>Hola mundo</h1>
      </div>

    </React.Fragment>
  );
};

Atomo.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(Atomo);