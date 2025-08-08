import PropTypes from "prop-types";
import React from "react";
import {
  Container
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import UsersCrudV2
import UsersCrudV2 from "./UsersCrudV2";

//i18n
import { withTranslation } from "react-i18next";

const CrudV1 = (props) => {

  //meta title
  document.title = "CRUD V1 | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="CRUD" breadcrumbItem="V1" />
          
          {/* Render CRUD V1 */}
          <UsersCrudV2 />
        </Container>
      </div>

    </React.Fragment>
  );
};

CrudV1.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(CrudV1);