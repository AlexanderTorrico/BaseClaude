import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Container } from "reactstrap";
import { AzHeaderCard } from "../../../components/aziende/AzHeader";

interface PageApiProps extends WithTranslation {}

const PageApi: React.FC<PageApiProps> = () => {

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    
                    <AzHeaderCard
                        title="Mi Título"
                        description="Descripción"
                        contentTopRight={<Button>Acción</Button>}
                    />

                    <h1>Hola mundo</h1>
                </Container>
            </div>
        </React.Fragment>
    );
}



export default withTranslation()(PageApi);