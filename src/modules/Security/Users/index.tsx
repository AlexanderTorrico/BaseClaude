import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Container } from "reactstrap";
import { AzHeaderCard } from "../../../components/aziende/AzHeader";

interface Users extends WithTranslation {}

const Users: React.FC<Users> = () => {

    return (
        <React.Fragment>
            <div className="page-content">
                <h1>Hola mundo</h1>
            </div>
        </React.Fragment>
    );
}



export default withTranslation()(Users);