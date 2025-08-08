import PropTypes from "prop-types";
import React from "react";
import {
  Container
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import UsersCrud
import UsersCrud from "./UsersCrud";

//i18n
import { withTranslation } from "react-i18next";

const CrudBasic = (props) => {

  //meta title
  document.title = "CrudBasic | Skote - Vite React Admin & CrudBasic Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title={props.t("CrudBasics")} breadcrumbItem={props.t("CrudBasic")} />
          
          {/* Render Users CRUD Table */}
          <UsersCrud />
        </Container>
      </div>

    </React.Fragment>
  );
};

CrudBasic.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(CrudBasic);
