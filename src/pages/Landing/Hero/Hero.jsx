import React from 'react'
import { useTranslation } from 'react-i18next';
import "./hero.css"

const Hero = () => {

    const { t } = useTranslation();

    const createPage = (event) => {
        event.preventDefault();
        console.log("creado");
    }

    return (
        <div className="hero">
            <h1> {t("Create a")} <span> {t("free website")} </span>{t("and launch your business")} </h1>
            <form onSubmit={createPage}>
                <input type="text" placeholder={t("create a landing page for my ...")} />
                <button type="submit" >
                    <i className="bx bx-arrow-up-stroke"></i>
                </button>
            </form>
        </div>
    )
}

export default Hero