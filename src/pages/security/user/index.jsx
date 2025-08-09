import PropTypes from "prop-types";
import React from "react";
import {
  Container
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

//Import UsersCrudV2
import UserContend from "./UsersContend";

//i18n
import { withTranslation } from "react-i18next";

const User = (props) => {

  //meta title
  document.title = "CRUD V1 | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="CRUD" breadcrumbItem="V1" />
          
          {/* Render CRUD V1 */}
          <UserContend />
        </Container>
      </div>

    </React.Fragment>
  );
};

User.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(User);