import PropTypes from "prop-types";
import React from "react";
import {
  Container
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import ModernCrud
import ModernCrud from "./ModernCrud";

//i18n
import { withTranslation } from "react-i18next";

const CrudModern = (props) => {

  //meta title
  document.title = "CRUD Moderno | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="CRUD" breadcrumbItem="Moderno" />
          
          {/* Render Modern CRUD */}
          <ModernCrud />
        </Container>
      </div>

    </React.Fragment>
  );
};

CrudModern.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(CrudModern);