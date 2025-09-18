import React from "react";
import {
  Container
} from "reactstrap";
import { WithTranslation, withTranslation } from "react-i18next";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import UsersCrud
import UsersCrud from "./UsersCrud";

interface DashboardProps extends WithTranslation {
  chartsData?: any;
  onGetChartsData?: () => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {

  //meta title
  document.title = "Dashboard | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title={props.t("Dashboards")} breadcrumbItem={props.t("Dashboard")} />
          
          {/* Render Users CRUD Table */}
          <UsersCrud />
        </Container>
      </div>

    </React.Fragment>
  );
};


export default withTranslation()(Dashboard);
