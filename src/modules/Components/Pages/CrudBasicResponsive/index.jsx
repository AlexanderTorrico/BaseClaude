import React from "react";
import { Container } from "reactstrap";
import { withTranslation } from "react-i18next";

const CrudBasicResponsive = () => {
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

CrudBasicResponsive.propTypes = {};
export default withTranslation()(CrudBasicResponsive);