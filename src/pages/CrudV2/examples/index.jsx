import PropTypes from "prop-types";
import React from "react";
import { Container } from "reactstrap";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import ProductsCrud from "./ProductsCrud";

import { withTranslation } from "react-i18next";

const ProductsPage = (props) => {
  document.title = "Products CRUD | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="CRUD" breadcrumbItem="Products Example" />
          <ProductsCrud />
        </Container>
      </div>
    </React.Fragment>
  );
};

ProductsPage.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(ProductsPage);