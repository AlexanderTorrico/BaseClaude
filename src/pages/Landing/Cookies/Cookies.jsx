import React, { useEffect, useState } from 'react'
import "./cookies.css"
import { useTranslation } from 'react-i18next';
// import { PRIVACYPOLICY } from '../../Helpers/Paths';

const Cookies = () => {

    const { t } = useTranslation();

    const [mostrar, setmostrar] = useState(false)
    const [cookies, setcookies] = useState(false)

    const cookiesAccepted = () => {
        localStorage.setItem('cookie', 'accepted');
        setcookies(false);
    }

    const cookiesRejected = () => {
        localStorage.setItem('cookie', 'rejected');
        setcookies(false);
    }

    useEffect(() => {
        const consent = localStorage.getItem('cookie');
        if (!consent) {
            setcookies(true);
        }
    }, []);
    return (
        <>
            {cookies &&
                <div
                    id="contendCookies"
                    style={{
                        position: "fixed",
                        bottom: "0",
                        width: "100%",
                        padding: "10px 1rem 10px 1rem"
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#2A3042",
                            padding: "1rem",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            border: "2px solid #3c4355"
                        }}
                    >
                        <p style={{ fontWeight: "600", fontSize: "1.2rem" }} > {t("Privacy Notice")} </p>
                        <p> {t("cookie_paragraph_one")} <a href={"PRIVACYPOLICY"} id="privacy" style={{ textDecoration: "underline", cursor: "pointer", fontWeight: "700" }} > {t("the privacy briefing.")} </a> </p>

                        <div style={{ cursor: "pointer", display: "flex", gap: ".5rem", alignItems: "center" }} onClick={() => { setmostrar(!mostrar) }}>
                            {mostrar ? <p> {t("Hide options")} </p> : <p>{t("Show options")} </p>}
                            <i className={`bx bxs-chevron-${mostrar ? "up" : "down"}`} style={{ color: "#ffbc1f" }} ></i>
                        </div>
                        {mostrar &&
                            <>
                                <p>{t("cookie_paragraph_two")}</p>
                                <div id="contendOpcionCookies" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
                                    <div style={{}}>

                                        <label htmlFor="check1" style={{ display: "flex", gap: ".5rem", cursor: "pointer" }}>
                                            <input id="check1" type="checkbox" defaultChecked={true} disabled />
                                            <p >{t("Necessary")}</p>
                                        </label>
                                        <p> {t("cookie_paragraph_three")} </p>
                                    </div>
                                    <div style={{}}>
                                        <label htmlFor="check2" style={{ display: "flex", gap: ".5rem", cursor: "pointer" }}>
                                            <input id="check2" type="checkbox" />
                                            <p > {t("Marketing")} </p>
                                        </label>
                                        <p> {t("cookie_paragraph_four")} </p>

                                    </div>
                                    <div style={{}}>
                                        <label htmlFor="check3" style={{ display: "flex", gap: ".5rem", cursor: "pointer" }}>
                                            <input id="check3" type="checkbox" />
                                            <p >{t("Performance")} </p>
                                        </label>
                                        <p> {t("cookie_paragraph_five")} </p>

                                    </div>
                                    <div style={{}}>
                                        <label htmlFor="check4" style={{ display: "flex", gap: ".5rem", cursor: "pointer" }}>
                                            <input id="check4" type="checkbox" />
                                            <p > {t("Functional")} </p>
                                        </label>
                                        <p> {t("cookie_paragraph_six")} </p>

                                    </div>
                                </div>
                            </>

                        }
                        <div id="contendCokkiesButtons" style={{ display: "grid", gridTemplateColumns: "8rem 8rem", gap: "1rem", justifyContent: "end" }}>
                            <button onClick={() => { { cookiesAccepted() } }} style={{ border: "2px #ffbc1f solid", height: "2rem", padding: "0 1rem", background: "transparent", color: "white" }} >{t("REJECT")}</button>
                            <button onClick={() => { { cookiesRejected() } }} style={{ background: "#ffbc1f", padding: "0 1rem", height: "2rem", borderStyle: "none", color: "#151a20" }} > {t("ACCEPT")} </button>
                        </div>

                    </div>
                </div>
            }
        </>


    )
}

export default Cookies;
