import { useTranslation } from 'react-i18next';
import Header from '../Header/Header';
import React, { useEffect } from 'react';
//
import { useNavigate } from 'react-router-dom';

const LegalPrivacy = () => {
    const { t, i18n } = useTranslation();

    const Pp_paragraph_2 = t('Pp_paragraph_2').split('\n');
    const Pp_paragraph_3 = t('Pp_paragraph_3').split('\n');
    const Pp_paragraph_4 = t('Pp_paragraph_4').split('\n');

    useEffect(() => {
        const listLenguaje = ['en', 'it', 'es'];
        const languageBrowser = navigator.language.slice(0, 2); //'en-US' → 'en'
        const languageDetected = listLenguaje.includes(languageBrowser) ? languageBrowser : 'en';
        console.log("Idioma detectado:", languageDetected);
        console.log((languageDetected == "en" && "eng") || (languageDetected == "es" && "esp") || "it");

        i18n.changeLanguage((languageDetected == "en" && "eng") || (languageDetected == "es" && "sp") || "it");
        // i18n.changeLanguage("eng");
    }, [])

    // const navigate = useNavigate();

    return (
        <div className="landing">
            <Header />
            <div style={{
                width: "100%",
                height: "100%",
                padding: "6rem 1rem 1rem 1rem",
                background: "#ffffff",
                color: "var(--aziende-background-shade)"
            }}>
                <h1>{t("Privacy Policy")}</h1>
                <br />
                <h6>{t("Pp_subtitle_1")} </h6>
                <p>{t("Pp_paragraph_1")} </p>
                <br />
                <h6>{t("Pp_subtitle_2")} </h6>
                {Pp_paragraph_2.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p key={i}>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("Pp_subtitle_3")} </h6>
                {Pp_paragraph_3.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p key={i}>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("Pp_subtitle_4")} </h6>
                {Pp_paragraph_4.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p key={i}>{line}</p>
                    </React.Fragment>
                ))}

                {/* <button style={{
                    height: "38px",
                    padding: "0px 1rem",
                    border: "2px var(--accent) solid",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: "var(--accent)",
                    color: "var(--aziende-background-shade)",
                    fontWeight: "700",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: ".5rem",
                    margin: "1rem auto"
                }}

                    onClick={() => { navigate(-1) }}>
                    < i style={{ fontWeight: "700", color: "var(--aziende-background-shade)" }} className='bx  bx-home-alt' />
                    <p> {t("Go back")} </p>
                </button> */}
            </div>
        </div>
    )
}
export default LegalPrivacy