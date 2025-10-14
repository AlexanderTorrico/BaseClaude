import { useTranslation } from 'react-i18next';
import "./header.css"

const Header = () => {

    const { t } = useTranslation();
    return (
        <div className="header" >
            <img src="Aziende.svg" alt="" />
            <div className="containerBtn" >
                <button className="btnGetStared" > {t("Get stared")} </button>
                <button className="btnLogin" > {t("Login")} </button>
            </div>
        </div>
    )
}

export default Header