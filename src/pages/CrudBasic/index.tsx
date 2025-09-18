import React from "react";
import {
  Container
} from "reactstrap";
import { WithTranslation, withTranslation } from "react-i18next";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import UsersCrud
import UsersCrud from "./UsersCrud";

interface CrudBasicProps extends WithTranslation {
  chartsData?: any;
  onGetChartsData?: () => void;
}

const CrudBasic: React.FC<CrudBasicProps> = (props) => {

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


export default withTranslation()(CrudBasic);
