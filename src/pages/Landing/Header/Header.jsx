import { useTranslation } from 'react-i18next';
import "./header.css"

const Header = () => {

    const { t } = useTranslation();
    return (
        <div className="header" >
            <img src="Aziende.svg" alt="Aziende Logo" />
            <div className="containerBtn" >
                <button className="btnGetStared">Crear cuenta</button>
                <button className="btnLogin">Iniciar sesión</button>
            </div>
        </div>
    )
}

export default Header