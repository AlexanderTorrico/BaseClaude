import React from "react";
import {
  Container
} from "reactstrap";
import { WithTranslation, withTranslation } from "react-i18next";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import UsersCrudV1
import UsersCrudV1 from "./UsersCrudV1";

interface CrudV1Props extends WithTranslation {}

const CrudV1: React.FC<CrudV1Props> = (props) => {

  //meta title
  document.title = "CRUD V1 | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="CRUD" breadcrumbItem="V1" />
          
          {/* Render CRUD V1 */}
          <UsersCrudV1 />
        </Container>
      </div>

    </React.Fragment>
  );
};


export default withTranslation()(CrudV1);