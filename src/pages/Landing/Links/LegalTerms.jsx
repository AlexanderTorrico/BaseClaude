import React, { useEffect } from 'react'
import Header from '../Header/Header'
import { useTranslation } from 'react-i18next'
// import { useNavigate } from 'react-router-dom';

const LegalTerms = () => {

    const { t, i18n } = useTranslation();

    const tac_paragraph_2 = t('tac_paragraph_2').split('\n');
    const tac_paragraph_3 = t('tac_paragraph_3').split('\n');
    const tac_paragraph_4 = t('tac_paragraph_4').split('\n');
    const tac_paragraph_5 = t('tac_paragraph_5').split('\n');
    const tac_paragraph_6 = t('tac_paragraph_6').split('\n');
    const tac_paragraph_7 = t('tac_paragraph_7').split('\n');
    const tac_paragraph_8 = t('tac_paragraph_8').split('\n');
    const tac_paragraph_9 = t('tac_paragraph_9').split('\n');
    const tac_paragraph_10 = t('tac_paragraph_10').split('\n');
    const tac_paragraph_11 = t('tac_paragraph_11').split('\n');
    const tac_paragraph_12 = t('tac_paragraph_12').split('\n');
    const tac_paragraph_13 = t('tac_paragraph_13').split('\n');
    const tac_paragraph_14 = t('tac_paragraph_14').split('\n');
    const tac_paragraph_15 = t('tac_paragraph_15').split('\n');
    const tac_paragraph_16 = t('tac_paragraph_16').split('\n');

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
                <h1>{t("Terms and Conditions")} </h1>
                <br />
                <h6>{t("tac_subtilte_1")} </h6>
                <p>{t("tac_paragraph_1")} </p>
                <br />
                <h6>{t("tac_subtilte_2")} </h6>
                {tac_paragraph_2.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_3")} </h6>
                {tac_paragraph_3.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_4")} </h6>
                {tac_paragraph_4.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_5")} </h6>
                {tac_paragraph_5.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_6")} </h6>
                {tac_paragraph_6.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_7")} </h6>
                {tac_paragraph_7.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_8")} </h6>
                {tac_paragraph_8.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_9")} </h6>
                {tac_paragraph_9.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_10")} </h6>
                {tac_paragraph_10.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_11")} </h6>
                {tac_paragraph_11.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_12")} </h6>
                {tac_paragraph_12.map((line, i) => (
                    <React.Fragment key={i} >
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_13")} </h6>
                {tac_paragraph_13.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_14")} </h6>
                {tac_paragraph_14.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_15")} </h6>
                {tac_paragraph_15.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
                    </React.Fragment>
                ))}
                <br />
                <h6>{t("tac_subtilte_16")} </h6>
                {tac_paragraph_16.map((line, i) => (
                    <React.Fragment key={i}>
                        <br />
                        <p>{line}</p>
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
export default LegalTerms