import React from "react";
import {
  Container
} from "reactstrap";
import { WithTranslation, withTranslation } from "react-i18next";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import UsersCrudFacadeExample
import UsersCrudFacadeExample from "./UsersCrudFacadeExample";

interface CrudV2Props extends WithTranslation {}

const CrudV2: React.FC<CrudV2Props> = (props) => {

  //meta title
  document.title = "CRUD V2 Facade | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          
          {/* Render CRUD V2 with Facade Pattern */}
          <UsersCrudFacadeExample />
        </Container>
      </div>

    </React.Fragment>
  );
};


export default withTranslation()(CrudV2);