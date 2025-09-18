import React from "react";
import {
  Container
} from "reactstrap";
import { WithTranslation, withTranslation } from "react-i18next";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import ModernCrud
import ModernCrud from "./ModernCrud";

interface CrudModernProps extends WithTranslation {}

const CrudModern: React.FC<CrudModernProps> = (props) => {

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


export default withTranslation()(CrudModern);