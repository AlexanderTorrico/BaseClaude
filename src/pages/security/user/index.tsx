import React from "react";
import {
  Container
} from "reactstrap";
import { WithTranslation, withTranslation } from "react-i18next";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

//Import UserContend
import UserContend from "./UsersContend";

interface UserProps extends WithTranslation {}

const User: React.FC<UserProps> = (props) => {

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


export default withTranslation()(User);