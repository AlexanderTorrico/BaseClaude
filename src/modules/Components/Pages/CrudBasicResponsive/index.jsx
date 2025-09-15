import React from "react";
import { Container, Button, Input, InputGroup, InputGroupText } from "reactstrap";
import { withTranslation } from "react-i18next";


const CrudBasicResponsive = () => {
    // Meta title
    
    return (
            <div className="page-content">
                <Container fluid>
                    <h1>Hola mundo</h1>
                </Container>
            </div>
    );
};

CrudBasicResponsive.propTypes = {};
export default withTranslation()(CrudBasicResponsive);