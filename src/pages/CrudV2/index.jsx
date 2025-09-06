import PropTypes from "prop-types";
import React from "react";
import {
  Container
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import UsersCrudV2
import UsersCrudFacadeExample from "./UsersCrudFacadeExample";

//i18n
import { withTranslation } from "react-i18next";

const CrudV1 = (props) => {

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

CrudV1.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(CrudV1);