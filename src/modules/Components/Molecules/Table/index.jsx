import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { Container } from "reactstrap";


const Table = () => {

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <h1>Hola mundo</h1>
                </Container>
            </div>
        </React.Fragment>
    );
}

Table.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(Table);